import WebSocket, { WebSocketServer } from 'ws';

import MessageData from '../proto/message-data';

import APIParser from './parser';
import {APICommands} from './commands';
import {APIDispatch} from './dispatch';

export default class APIWebsocketServer {
        constructor(J, host, port) {
                this.jesi = J;
                this.server = new WebSocketServer({ host: host, port: port});
                this.parser = new APIParser(J, this);

                this.server.on('connection', (ws) => {
                        ws.on('message', (data) => {
                                this.parser.run(ws, data.toString());
                        });

                        let privmsg_hook = (server, msgData) => {
                                APIDispatch['RECV'](ws, server.info, msgData);
                        };

                        let join_hook = (server, msgData) => {
                                APIDispatch['JOIN'](ws, server.info, msgData);
                        };

                        let part_hook = (server, msgData) => {
                                APIDispatch['PART'](ws, server.info, msgData);
                        };

                        J.on('PRIVMSG', privmsg_hook);
                        J.on('JOIN', join_hook);
                        J.on('PART', part_hook);
                        ws.on('close', () => {
                                J.no('PRIVMSG', privmsg_hook);
                                J.no('JOIN', join_hook);
                                J.no('PART', part_hook);
                        });

                        Object.values(J.clients).forEach(client => {
                                APIDispatch['CONNECT'](ws, client.info);
                                APIDispatch['NICK'](ws, client.info);

                                Object.values(client.info.channels).forEach(channel => {
                                        APIDispatch['JOIN'](ws, client.info, channel);
                                });

                                // Quick hack to receive outgoing messages
                                client.writer.executeFirst = (msg) => {
                                        let msgData = new MessageData(msg);
                                        msgData.parse();
                                        msgData.nick = client.info.user.nick;
                                        msgData.replyTarget = msgData.params[0];
                                        if (msgData.command === 'PRIVMSG')
                                                APIDispatch['RECV'](ws, client.info, msgData);
                                };
                        });
                });
        }
}

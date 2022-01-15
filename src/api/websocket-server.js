import WebSocket, { WebSocketServer } from 'ws';

import APIParser from './parser';
import {APICommands} from './commands';
import {APIDispatch} from './dispatch';

export default class APIWebsocketServer {
        constructor(J, host, port) {
                this.jesi = J;
                this.server = new WebSocketServer({ host: host, port: port});
                this.parser = new APIParser(J, this);

                this.server.on('connection', (ws) => {
                        this.socket = ws; // TODO: more sockets
                        ws.on('message', (data) => {
                                this.parser.run(data.toString());
                        });

                        J.on('PRIVMSG', (server, msgData) => {
                                APIDispatch['RECV'](this.socket, server.info, msgData);
                        });

                        Object.values(J.clients).forEach(client => {
                                APIDispatch['CONNECT'](this.socket, client.info);
                                Object.values(client.info.channels).forEach(channel => {
                                        APIDispatch['JOIN'](this.socket, client.info, channel);
                                });
                        });

                        J.on('JOIN', (server, msgData) => {
                                APIDispatch['JOIN'](this.socket, server.info, msgData.tail);
                        });
                });
        }
}

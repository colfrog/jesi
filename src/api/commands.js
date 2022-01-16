// SEND 'Server Name'.#channel | message
// SEND 'Server Name'.username | message
function api_commands_send(J, s, msg) {
        if (J.clients[msg.server]) {
                if (msg.channel)
                        J.clients[msg.server].writer.sendMessage(msg.channel, msg.data);
                else if (msg.user)
                        J.clients[msg.server].writer.sendMessage(msg.user, msg.data);
        }
}

function api_commands_tojesi(J, s, msg) {
        let server = J.clients[msg.server];
        let user = server.info.user;
        let msgData = {
                command: 'PRIVMSG',
                params: [msg.channel, msg.data],
                tail: msg.data,
                tailWords: msg.data.split(' '),
                nick: user.nick,
                ident: user.ident,
                host: user.host,
                replyTarget: msg.channel
        };

        if (server.modules)
                server.modules.toModules(server, msgData);
}

function api_commands_join(J, s, msg) {
        J.clients[msg.server].writer.joinChannels([msg.channel]);
}

function api_commands_part(J, s, msg) {
        J.clients[msg.server].writer.partFrom(msg.channel, msg.data);
}

function api_commands_channels(J, s, msg) {
        s.send(`CHANNELS '${msg.server}' | ${Object.keys(J.clients[msg.server].info.channels).join(' ')}`);
}

function api_commands_users(J, s, msg) {
        s.send(`USERS '${msg.server}'.${msg.channel} | ${Object.keys(J.clients[msg.server].info.channels[msg.channel].users).join(' ')}`);
}

export const APICommands = {
        'SEND': api_commands_send,
        'TOJESI': api_commands_tojesi,
        'JOIN': api_commands_join,
        'PART': api_commands_part,
        'CHANNELS': api_commands_channels,
        'USERS': api_commands_users,
};

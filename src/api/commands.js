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

function api_commands_join(J, s, msg) {
        J.clients[msg.server].writer.joinChannels([msg.channel]);
}

function api_commands_channels(J, s, msg) {
        s.send(`CHANNELS '${msg.server}' | ${Object.keys(J.clients[msg.server].info.channels).join(' ')}`);
}

function api_commands_users(J, s, msg) {
        s.send(`USERS '${msg.server}'.${msg.channel} | ${Object.keys(J.clients[msg.server].info.channels[msg.channel].users).join(' ')}`);
}

export const APICommands = {
        'SEND': api_commands_send,
        'JOIN': api_commands_join,
        'CHANNELS': api_commands_channels,
        'USERS': api_commands_users,
};

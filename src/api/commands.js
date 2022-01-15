// SEND 'Server Name'.#channel | message
// SEND 'Server Name'.username | message
function api_commands_send(J, s, msg) {
        if (J.clients[msg.server_name]) {
                if (msg.channel)
                        J.clients[msg.server_name].writer.sendMessage(msg.channel, msg.data);
                else if (msg.user)
                        J.clients[msg.server_name].writer.sendMessage(msg.user, msg.data);
        }
}

function api_commands_join(J, s, msg) {
        J.clients[msg.server_name].writer.joinChannels([msg.channel]);
}

function api_commands_channels(J, s, msg) {
        s.send(`CHANNELS '${msg.server_name}' | ${Object.keys(J.clients[msg.server_name].info.channels).join(' ')}`);
}

function api_commands_users(J, s, msg) {
        s.send(`USERS '${msg.server_name}'.${msg.channel} | ${Object.keys(J.clients[msg.server_name].info.channels[msg.channel].users).join(' ')}`);
}

export const APICommands = {
        'SEND': api_commands_send,
        'JOIN': api_commands_join,
        'CHANNELS': api_commands_channels,
        'USERS': api_commands_users,
};

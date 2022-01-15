// CONNECT 'Server Name'
function api_dispatch_connect(s, server) {
        s.send(`CONNECT '${server.name}'\r\n`);
}

// JOIN 'Server Name'.#channel
function api_dispatch_join(s, server, channel) {
        s.send(`JOIN '${server.name}'.${channel.name}\r\n`);
}

// RECV 'Server Name'.#channel.username | text
// RECV 'Server Name'.username | text
function api_dispatch_recv(s, server, msgData) {
        if (msgData.replyTarget === msgData.nick)
                s.send(`RECV '${server.name}'.${msgData.nick} | ${msgData.tail}\r\n`);
        else
                s.send(`RECV '${server.name}'.${msgData.replyTarget}.${msgData.nick} | ${msgData.tail}\r\n`);
}

export const APIDispatch = {
        'CONNECT': api_dispatch_connect,
        'JOIN': api_dispatch_join,
        'RECV': api_dispatch_recv,
};

// CONNECT 'Server Name'
function api_dispatch_connect(s, server) {
        s.send(`CONNECT '${server.name}'\r\n`);
}

// JOIN 'Server Name'.#channel
function api_dispatch_join(s, server, channel) {
        let toJoin = '';
        if (channel.name)
                toJoin = channel.name;
        else if (channel.tail)
                toJoin = channel.tail;
        else if (channel.params)
                toJoin = channel.params[0];

        s.send(`JOIN '${server.name}'.${toJoin}\r\n`);
}

function api_dispatch_part(s, server, msgData) {
        s.send(`PART '${server.name}'.${msgData.params[0]}.${msgData.user} | ${msgData.tail}\r\n`);
}

// RECV 'Server Name'.#channel.username | text
// RECV 'Server Name'.username | text
function api_dispatch_recv(s, server, msgData) {
        if (msgData.replyTarget === msgData.nick)
                s.send(`RECV '${server.name}'.${msgData.nick} | ${msgData.tail}\r\n`);
        else
                s.send(`RECV '${server.name}'.${msgData.replyTarget}.${msgData.nick} | ${msgData.tail}\r\n`);
}

function api_dispatch_nick(s, server, msgData) {
        if (msgData)
                s.send(`NICK '${server.name}'.${msgData.nick} | ${msgData.params[0]}\r\n`);
        else
                s.send(`NICK '${server.name}'.${server.user.nick}\r\n`);
}

export const APIDispatch = {
        'CONNECT': api_dispatch_connect,
        'JOIN': api_dispatch_join,
        'PART': api_dispatch_part,
        'RECV': api_dispatch_recv,
        'NICK': api_dispatch_nick,
};

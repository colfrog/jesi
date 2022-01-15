import {APICommands} from './commands';

export default class APIParser {
        constructor(J, serv) {
                this.jesi = J;
                this.server = serv;
        }

        run(text) {
                let msg = this.parse(text);
                if (msg && msg.command && APICommands[msg.command])
                        APICommands[msg.command](this.jesi, this.server.socket, msg);
        }

        parse(text) {
                let m = text.trim().match(/^([A-Z]+)\s+\'(.+)\'(?:\.(#[^\.\s]+))?(?:\.([^\.\s]+))?(?:\s*\|\s*(.+))?$/);
                if (m)
                        return {
                                'command': m[1],
                                'server_name': m[2],
                                'channel': m[3],
                                'user': m[4],
                                'data': m[5]
                        };
                else
                        return null;
        }
}

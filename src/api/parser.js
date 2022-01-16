import {APICommands} from './commands';

export default class APIParser {
        constructor(J) {
                this.jesi = J;
        }

        run(s, text) {
                let msg = this.parse(text);
                if (msg && msg.command && APICommands[msg.command])
                        APICommands[msg.command](this.jesi, s, msg);
        }

        parse(text) {
                let m = text.trim().match(/^([A-Z]+)\s+\'(.+)\'(?:\.(#[^\.\s]+))?(?:\.([^\.\s]+))?(?:\s*\|\s*(.+))?$/);
                if (m)
                        return {
                                'command': m[1],
                                'server': m[2],
                                'channel': m[3],
                                'user': m[4],
                                'data': m[5]
                        };
                else
                        return null;
        }
}

"use strict";

var _irc = _interopRequireDefault(require("./irc/irc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var client = new _irc["default"]('Snoonet', 'irc.snoonet.org', 6697, true);
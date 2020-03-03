"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var irc = /*#__PURE__*/function () {
  function irc(server_name, host_name, port, tls) {
    _classCallCheck(this, irc);

    this.servers = {};
    if (typeof server_name !== 'undefined' && typeof host_name !== 'undefined' && typeof port !== 'undefined') this.add_server(server_name, host_name, port, tls);
  }

  _createClass(irc, [{
    key: "add_server",
    value: function add_server(server_name, host_name, port, tls) {
      this.servers[server_name] = new _server["default"](server_name, host_name, port, tls);
    }
  }]);

  return irc;
}();

exports["default"] = irc;
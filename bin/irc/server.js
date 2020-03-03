"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _net = _interopRequireDefault(require("net"));

var _tls = _interopRequireDefault(require("tls"));

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var server = /*#__PURE__*/function () {
  function server(server_name, host_name, port, tls) {
    _classCallCheck(this, server);

    this.name = server_name;
    this.host = host_name;
    this.port = port;
    this.tls = this.is_tls(port, tls);
    this.socket = this.make_socket();
  }

  _createClass(server, [{
    key: "on_socket_data",
    value: function () {
      var _on_socket_data = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee(data) {
        return _regeneratorRuntime["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log(this.name + ' (' + data.length + ' bytes): ' + data.trim());

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function on_socket_data(_x) {
        return _on_socket_data.apply(this, arguments);
      }

      return on_socket_data;
    }()
  }, {
    key: "on_dead_socket",
    value: function () {
      var _on_dead_socket = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee2() {
        return _regeneratorRuntime["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.socket = this.make_socket();

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function on_dead_socket() {
        return _on_dead_socket.apply(this, arguments);
      }

      return on_dead_socket;
    }()
  }, {
    key: "make_socket",
    value: function make_socket() {
      console.log("Connection to server " + this.name + " on " + this.host + ":" + this.port);

      var socket = _net["default"].connect({
        host: this.host,
        port: this.port
      });

      if (this.tls) {
        socket = _tls["default"].connect({
          host: this.host,
          port: this.port,
          socket: socket
        });
      }

      socket.setEncoding('utf8');
      socket.on('data', this.on_socket_data.bind(this));
      socket.on('end', this.on_dead_socket.bind(this));
      return socket;
    }
  }, {
    key: "is_tls",
    value: function is_tls(port, tls) {
      if (tls === true || tls === false) return tls;
      return this.is_tls_port(port);
    }
  }, {
    key: "is_tls_port",
    value: function is_tls_port(port) {
      /*
       * Common non-SSL IRC ports
       * yes 7000 is ambiguous, an unencrypted connection will
       * be used as fallback if TLS fails (the user will be warned),
       * so might as well try.
       */
      if (port == 194) return false;
      /* Common SSL IRC ports */

      if (port == 994 || port == 7000 || port == 7070) return true;
      /* False for 6660-6669 */

      for (var i = 6660; i <= 6669; i++) {
        if (port == i) return false;
      }
      /* True for 6690-6699 */


      for (var _i = 6690; _i <= 6699; _i++) {
        if (port == _i) return true;
      }
      /* True for 9990-9999 */


      for (var _i2 = 9990; _i2 <= 9999; _i2++) {
        if (port == _i2) return true;
      }
      /* Default to true */


      console.warn('TLS unspecified and couldn\'t guess from port, defaulting to true');
      return true;
    }
  }]);

  return server;
}();

exports["default"] = server;
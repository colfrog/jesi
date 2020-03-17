// Read a configuration file and set default options.
export default class Config {
  constructor(path = '') {
    this.path = path || `${process.cwd()}/config.json`
    this.config = require(this.path)

    this.commandPrefix = this.config.commandPrefix
    this.modules = this.config.modules
    this.servers = this.config.servers

    this._initDefaults()
  }

  _initDefaults () {
    this.defaults = this.config.defaults || { }

    this.servers.forEach((server) => {
      const defaultUserInfo = this.defaults.userInfo

      server.userInfo = Object.assign({ }, defaultUserInfo, server.userInfo)
    })
  }
}


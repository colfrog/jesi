// Read a configuration file and set default options.
export default class Config {
  constructor(path = '') {
    this.path = path || `${process.cwd()}/config.json`
    this.config = require(this.path)

    this.commandPrefix = this.config.commandPrefix
    this.modules = this.config.modules
    this.servers = this.config.servers

    this._mergeDefaults()
  }

  _mergeDefaults () {
    this.defaults = this.config.defaults || { }

    const defaultUserInfo = this.defaults.userInfo

    this.servers.forEach(server =>
      server.userInfo = Object.assign({ }, defaultUserInfo, server.userInfo))
  }
}


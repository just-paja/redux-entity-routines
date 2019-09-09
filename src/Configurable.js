import { NamedObject } from './NamedObject'

export class Configurable extends NamedObject {
  config = {}

  constructor (name, config = {}) {
    super(name)
    this.configure(config)
  }

  configure (config) {
    this.config = { ...this.config, ...config }
  }
}

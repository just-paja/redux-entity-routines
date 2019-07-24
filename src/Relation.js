import { Configurable } from './Configurable'

export class Relation extends Configurable {
  get connection () {
    return `${this.parent.name}:${this.target.name}`
  }

  get name () {
    return `relation(${this.connection})`
  }

  get parent () {
    return this.config.parent
  }

  get target () {
    return this.config.target
  }

  toString () {
    return this.name
  }
}

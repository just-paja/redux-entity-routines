import { Configurable } from './Configurable'

export class Relation extends Configurable {
  constructor (config) {
    super('[Relation]', config)
  }

  get connection () {
    return `${this.parent.name}:${this.target.name}`
  }

  get parent () {
    return this.config.parent
  }

  get target () {
    return this.config.target
  }

  get relationName () {
    return `relation(${this.connection})`
  }

  toString () {
    return this.relationName
  }
}

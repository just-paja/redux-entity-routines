import camelCase from 'camelcase'

export class NamedObject {
  name = null

  constructor (name) {
    this.configureName(name)
  }

  configureName (name) {
    if (!name || typeof name !== 'string') {
      throw new Error(`Name is required, but "${name}" was given`)
    }
    this.name = camelCase(name)
  }
}

import { Configurable } from '../Configurable'

describe('configurable', () => {
  it('throws when given no name', () => {
    expect(() => new Configurable()).toThrow('Name is required, but "undefined" was given')
  })

  it('instantiates without config', () => {
    expect(() => new Configurable('Test')).not.toThrow()
  })
})

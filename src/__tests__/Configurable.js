import { Configurable } from '../Configurable'

describe('configurable', () => {
  it('instantiates without config', () => {
    expect(() => new Configurable()).not.toThrow()
  })
})

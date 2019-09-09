import { NamedObject } from '../NamedObject'

describe('NamedObject', () => {
  it('throws error given name is null', () => {
    expect(() => new NamedObject(null)).toThrow('Name is required, but "null" was given')
  })

  it('throws error given name is an array', () => {
    expect(() => new NamedObject(['sound'])).toThrow('Name is required, but "sound" was given')
  })
})

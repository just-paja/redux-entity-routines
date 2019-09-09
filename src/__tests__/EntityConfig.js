import { EntityConfig } from '..'

describe('EntityConfig', () => {
  it('throws error given identSource is object', () => {
    expect(() => new EntityConfig({ name: 'sound', identSource: {} })).toThrow('Unsupported identifier type: "object"')
  })

  it('throws error given identSource is null', () => {
    expect(() => new EntityConfig({ name: 'sound', identSource: null })).toThrow('Unsupported identifier type: "object"')
  })

  it('getIdentifier resolves ident of null item as null', () => {
    const sound = new EntityConfig({
      identSource: 'id',
      name: 'sound'
    })
    expect(sound.getIdentifier(null)).toBe(null)
  })

  it('getIdentifier resolves ident of empty string item as null', () => {
    const sound = new EntityConfig({
      identSource: 'id',
      name: 'sound'
    })
    expect(sound.getIdentifier('')).toBe(null)
  })

  it('getIdentifier resolves ident of entity with internalid', () => {
    const sound = new EntityConfig({
      identSource: 'id',
      name: 'sound'
    })
    expect(sound.getIdentifier({
      _id: '666'
    })).toBe('666')
  })

  it('getIdentifier resolves ident of entity with attr ident', () => {
    const sound = new EntityConfig({
      identSource: 'id',
      name: 'sound'
    })
    expect(sound.getIdentifier({
      id: '666'
    })).toBe('666')
  })

  it('getIdentifier resolves ident of entity with empty attr ident as null', () => {
    const sound = new EntityConfig({
      identSource: 'id',
      name: 'sound'
    })
    expect(sound.getIdentifier({
      name: 'At the gates of hell'
    })).toBe(null)
  })

  it('getIdentifier resolves ident of entity with composed ident', () => {
    const sound = new EntityConfig({
      identSource: ['category', 'sound'],
      name: 'categorySound'
    })
    expect(sound.getIdentifier({
      sound: '666',
      category: '747'
    })).toBe('747-666')
  })

  it('getIdentifier resolves ident of entity with function ident', () => {
    const sound = new EntityConfig({
      identSource: item => item._links.self,
      name: 'categorySound'
    })
    expect(sound.getIdentifier({
      _links: {
        self: 'sounds/666'
      }
    })).toBe('sounds/666')
  })

  it('formatEntity returns object given item is null', () => {
    const sound = new EntityConfig({
      identSource: 'id',
      name: 'sound'
    })
    expect(sound.formatEntity(null)).toEqual(null)
  })

  it('formatEntity returns object given item is string and entity has string identifier', () => {
    const sound = new EntityConfig({
      identSource: 'id',
      name: 'sound'
    })
    expect(sound.formatEntity('666')).toEqual({
      id: '666'
    })
  })

  it('formatEntity returns the same given item already has identifier and entity has string identifier', () => {
    const sound = new EntityConfig({
      identSource: 'id',
      name: 'sound'
    })
    const soundItem = { id: '666' }
    expect(sound.formatEntity(soundItem)).toBe(soundItem)
  })

  it('formatEntity returns object given item is string and entity has composed identifier', () => {
    const sound = new EntityConfig({
      identSource: ['category', 'sound'],
      name: 'categorySound'
    })
    expect(sound.formatEntity('747-666')).toEqual({
      _id: '747-666'
    })
  })

  it('formatEntity returns object with internal id given item does not have an identifier and entity has composed identifier', () => {
    const sound = new EntityConfig({
      identSource: ['category', 'sound'],
      name: 'categorySound'
    })
    const soundItem = {
      category: '747',
      sound: '666'
    }
    expect(sound.formatEntity(soundItem)).toHaveProperty('_id', '747-666')
  })

  it('formatEntity returns the same given item already has identifier and entity has composed identifier', () => {
    const sound = new EntityConfig({
      identSource: ['category', 'sound'],
      name: 'categorySound'
    })
    const soundItem = {
      _id: '747-666',
      category: '747',
      sound: '666'
    }
    expect(sound.formatEntity(soundItem)).toBe(soundItem)
  })

  it('formatEntity returns object given item is string and entity has function based identifier', () => {
    const sound = new EntityConfig({
      identSource: item => item._links.self,
      name: 'sound'
    })
    expect(sound.formatEntity('747-666')).toEqual({
      _id: '747-666'
    })
  })

  it('formatEntity returns object with internal id given item does not have an identifier and entity has function based identifier', () => {
    const sound = new EntityConfig({
      identSource: item => item._links.self,
      name: 'sound'
    })
    const soundItem = {
      _links: {
        self: '/sounds/666'
      }
    }
    expect(sound.formatEntity(soundItem)).toHaveProperty('_id', '/sounds/666')
  })

  it('formatEntity returns the same given item already has identifier and entity has function based identifier', () => {
    const sound = new EntityConfig({
      identSource: item => item._links.self,
      name: 'sound'
    })
    const soundItem = {
      _id: '/sounds/666',
      _links: {
        self: '/sounds/666'
      }
    }
    expect(sound.formatEntity(soundItem)).toBe(soundItem)
  })
})

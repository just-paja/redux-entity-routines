import { createBelongsTo } from '../BelongsTo'
import { createEntitiesReducer, createEntityStore, createAsyncRoutine } from '..'

describe('BelongsTo', () => {
  it('does not fail given target name is missing in parent payload', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      identSource: 'uuid',
      name: 'sounds',
      belongsTo: [
        { collection: 'tags', attr: 'tag' }
      ],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      identSource: 'uuid',
      name: 'tags',
      providedBy: [tagsRoutine]
    })
    const reducer = createEntitiesReducer(sounds, tags)
    const payload = [
      {
        uuid: '3',
        name: 'sound-1'
      }
    ]
    expect(() => reducer(undefined, soundsRoutine.success(payload))).not.toThrow()
  })

  it('does not fail given parent name is missing in target payload', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      identSource: 'uuid',
      name: 'sounds',
      belongsTo: [
        { collection: 'tags', attr: 'tag' }
      ],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      identSource: 'uuid',
      name: 'tags',
      providedBy: [tagsRoutine]
    })
    const reducer = createEntitiesReducer(sounds, tags)
    const payload = [
      {
        uuid: '7',
        name: 'bar'
      }
    ]
    expect(() => reducer(undefined, tagsRoutine.success(payload))).not.toThrow()
  })

  it('does not fail given parent has no providers', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      identSource: 'uuid',
      name: 'sounds',
      belongsTo: [
        { collection: 'tags', attr: 'tag' }
      ],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      identSource: 'uuid',
      name: 'tags'
    })
    const reducer = createEntitiesReducer(sounds, tags)
    const payload = [
      {
        uuid: '7',
        name: 'bar'
      }
    ]
    expect(() => reducer(undefined, tagsRoutine.success(payload))).not.toThrow()
  })

  it('does not fail given target has no providers', () => {
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      identSource: 'uuid',
      name: 'sounds',
      belongsTo: [
        { collection: 'tags', attr: 'tag' }
      ]
    })
    const tags = createEntityStore({
      identSource: 'uuid',
      name: 'tags',
      providedBy: [tagsRoutine]
    })
    const reducer = createEntitiesReducer(sounds, tags)
    const payload = [
      {
        uuid: '7',
        name: 'bar'
      }
    ]
    expect(() => reducer(undefined, tagsRoutine.success(payload))).not.toThrow()
  })

  it('stores parent entities without belongs to attribute from parent payload', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      identSource: 'uuid',
      name: 'sounds',
      belongsTo: [
        { collection: 'tags', attr: 'tag' }
      ],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      identSource: 'uuid',
      name: 'tags',
      providedBy: [tagsRoutine]
    })
    const reducer = createEntitiesReducer(sounds, tags)
    const payload = [
      {
        uuid: '3',
        name: 'sound-1',
        tag: {
          uuid: '5',
          name: 'foo'
        }
      },
      {
        uuid: '4',
        name: 'sound-2',
        tag: {
          uuid: '7',
          name: 'bar'
        }
      },
      {
        uuid: '5',
        name: 'sound-3',
        tag: {
          uuid: '5',
          name: 'foo'
        }
      }
    ]
    expect(reducer(undefined, soundsRoutine.success(payload))).toHaveProperty('sounds', [
      { uuid: '3', name: 'sound-1', tag: '5' },
      { uuid: '4', name: 'sound-2', tag: '7' },
      { uuid: '5', name: 'sound-3', tag: '5' }
    ])
  })

  it('creates relation target entities from parent payload', () => {
    const soundsRoutine = createAsyncRoutine('SOUNDS')
    const tagsRoutine = createAsyncRoutine('TAGS')
    const sounds = createEntityStore({
      identSource: 'uuid',
      name: 'sounds',
      belongsTo: [
        { collection: 'tags', attr: 'tag' }
      ],
      providedBy: [soundsRoutine]
    })
    const tags = createEntityStore({
      identSource: 'uuid',
      name: 'tags',
      providedBy: [tagsRoutine]
    })
    const reducer = createEntitiesReducer(sounds, tags)
    const payload = [
      {
        uuid: '3',
        name: 'sound-1',
        tag: {
          uuid: '5',
          name: 'foo'
        }
      },
      {
        uuid: '4',
        name: 'sound-2',
        tag: {
          uuid: '7',
          name: 'bar'
        }
      },
      {
        uuid: '5',
        name: 'sound-3',
        tag: {
          uuid: '5',
          name: 'foo'
        }
      }
    ]
    expect(reducer(undefined, soundsRoutine.success(payload))).toHaveProperty('tags', [
      {
        uuid: '5',
        name: 'foo'
      },
      {
        uuid: '7',
        name: 'bar'
      }
    ])
  })

  it('converts relationship representation to string in a readable way', () => {
    const parent = createEntityStore({
      name: 'user',
      identSource: 'uuid',
      belongsTo: [
        { collection: 'group' }
      ]
    })
    const target = createEntityStore({
      name: 'group',
      identSource: 'uuid'
    })
    const relations = createBelongsTo([parent, target])
    expect(relations[0] + '').toBe('belongsTo(user:group)')
  })

  it('throws exception given target store does not exist', () => {
    const parent = createEntityStore({
      name: 'user',
      identSource: 'uuid',
      belongsTo: [
        { collection: 'group' }
      ]
    })
    expect(() => {
      createBelongsTo([parent])
    }).toThrow('Cannot find entity store called "group"')
  })
})

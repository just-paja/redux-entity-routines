import { EntityConfig, createEntityStore, createAsyncRoutine } from '..'

describe('EntityStore', () => {
  it('provides collection name', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    expect(store).toHaveProperty('name', 'user')
  })

  it('provides providedBy routines', () => {
    const routine = createAsyncRoutine('TEST')
    const store = createEntityStore(new EntityConfig({
      identSource: 'uuid',
      name: 'user',
      providedBy: [routine]
    }))
    expect(store).toHaveProperty('config.providedBy', [routine])
  })

  it('provides deletedBy routines', () => {
    const routine = createAsyncRoutine('TEST')
    const store = createEntityStore({
      identSource: 'uuid',
      deletedBy: [routine],
      name: 'user'
    })
    expect(store).toHaveProperty('config.deletedBy', [routine])
  })

  it('provides collectionReducers', () => {
    const routine = createAsyncRoutine('TEST')
    const reducer = state => state
    const store = createEntityStore({
      identSource: 'uuid',
      collectionReducers: {
        [routine.SUCCESS]: reducer
      },
      name: 'user'
    })
    expect(store).toHaveProperty('config.collectionReducers', {
      [routine.SUCCESS]: reducer
    })
  })

  it('provides on reducers', () => {
    const routine = createAsyncRoutine('TEST')
    const reducer = state => state
    const store = createEntityStore({
      identSource: 'uuid',
      on: {
        [routine.SUCCESS]: reducer
      },
      name: 'user'
    })
    expect(store).toHaveProperty('config.on', {
      [routine.SUCCESS]: reducer
    })
  })

  it('getAll selector returns all entities', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { uuid: '1' },
          { uuid: '2' }
        ]
      }
    }
    expect(store.getAll(state)).toEqual([
      { uuid: '1' },
      { uuid: '2' }
    ])
  })

  it('getObject selector returns entity matching identAttr given it exists', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { uuid: '1', name: 'foo' },
          { uuid: '2', name: 'bar' }
        ]
      }
    }
    expect(store.getObject(state, '2')).toEqual({ uuid: '2', name: 'bar' })
  })

  it('getObject selector returns null given entity matching identAttr does not exist', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { uuid: '1', name: 'foo' },
          { uuid: '2', name: 'bar' }
        ]
      }
    }
    expect(store.getObject(state, '3')).toEqual(null)
  })

  it('getFlag selector returns true given entity matching identAttr exists and is truthy', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { uuid: '1', name: 'foo', active: false },
          { uuid: '2', name: 'bar', active: true }
        ]
      }
    }
    expect(store.getFlag(state, '2', 'active')).toBe(true)
  })

  it('getFlag selector returns false given entity matching identAttr exists and is falsy', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { uuid: '1', name: 'foo', active: false },
          { uuid: '2', name: 'bar', active: false }
        ]
      }
    }
    expect(store.getFlag(state, '2', 'active')).toBe(false)
  })

  it('getFlag selector returns false given entity matching identAttr does not exist', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { uuid: '1', name: 'foo', active: false },
          { uuid: '2', name: 'bar', active: true }
        ]
      }
    }
    expect(store.getFlag(state, '3', 'active')).toBe(false)
  })

  it('getProp selector returns prop value given entity matching identAttr exists', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { uuid: '1', name: 'foo', active: false },
          { uuid: '2', name: 'bar', active: true }
        ]
      }
    }
    expect(store.getProp(state, '2', 'name')).toBe('bar')
  })

  it('getProp selector returns null given entity matching identAttr does not exist', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { uuid: '1', name: 'foo', active: false },
          { uuid: '2', name: 'bar', active: true }
        ]
      }
    }
    expect(store.getProp(state, '3', 'name')).toBe(null)
  })

  it('getSize selector returns entity count', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { uuid: '1', name: 'foo', active: false },
          { uuid: '2', name: 'bar', active: true }
        ]
      }
    }
    expect(store.getSize(state)).toBe(2)
  })

  it('isEmpty selector returns true given entity count is zero', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const state = {
      entities: {
        user: []
      }
    }
    expect(store.isEmpty(state)).toBe(true)
  })

  it('isEmpty selector returns false given entity count one', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { uuid: '1', name: 'foo', active: false },
          { uuid: '2', name: 'bar', active: true }
        ]
      }
    }
    expect(store.isEmpty(state)).toBe(false)
  })

  it('store converts to readable string', () => {
    const store = createEntityStore({
      identSource: 'id',
      name: 'user'
    })
    expect(store + '').toEqual('EntityStore(user)')
  })

  it('createFindSelector returns item via ident selector', () => {
    const store = createEntityStore({
      identSource: 'id',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { id: 1, name: 'foo' },
          { id: 2, name: 'bar' }
        ]
      },
      selectedUser: 2
    }
    const idSelector = state => state.selectedUser
    const selector = store.createFindSelector(idSelector)
    expect(selector(state)).toEqual({ id: 2, name: 'bar' })
  })

  it('createFindSelector returns null given item ident does not exist', () => {
    const store = createEntityStore({
      identSource: 'id',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { id: 1, name: 'foo' },
          { id: 2, name: 'bar' }
        ]
      },
      selectedUser: 3
    }
    const idSelector = state => state.selectedUser
    const selector = store.createFindSelector(idSelector)
    expect(selector(state)).toEqual(null)
  })

  it('createFindSelector returns null given item ident is null', () => {
    const store = createEntityStore({
      identSource: 'id',
      name: 'user'
    })
    const state = {
      entities: {
        user: [
          { id: 1, name: 'foo' },
          { id: 2, name: 'bar' }
        ]
      },
      selectedUser: null
    }
    const idSelector = state => state.selectedUser
    const selector = store.createFindSelector(idSelector)
    expect(selector(state)).toEqual(null)
  })

  it('getViewEntities selector throws given view is not configured', () => {
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    store.initialize('stuff')
    const state = {
      stuff: {
        entities: {
          user: [
            { uuid: '1' },
            { uuid: '2' }
          ]
        },
        views: {
          TEST_VIEW: {
            entities: ['1', '2']
          }
        }
      }
    }
    expect(() => store.getViewEntities(state, 'TEST_VIEW')).toThrow('Entity "user" does not belong to view "TEST_VIEW"')
  })

  it('getViewEntities selector returns view entities', () => {
    const routine = createAsyncRoutine('TEST_ROUTINE')
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user',
      views: [
        { name: 'TEST_VIEW', routine }
      ]
    })
    store.initialize('stuff')
    const state = {
      stuff: {
        entities: {
          user: [
            { uuid: '1' },
            { uuid: '2' }
          ]
        },
        views: {
          TEST_VIEW: {
            entities: ['1', '2']
          }
        }
      }
    }
    expect(store.getViewEntities(state, 'TEST_VIEW')).toEqual([
      { uuid: '1' },
      { uuid: '2' }
    ])
  })

  it('getViewEntities selector returns empty array given view is not in the state', () => {
    const routine = createAsyncRoutine('TEST_ROUTINE')
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user',
      views: [
        { name: 'TEST_VIEW', routine }
      ]
    })
    store.initialize('stuff')
    const state = {
      stuff: {
        entities: {
          user: [
            { uuid: '1' },
            { uuid: '2' }
          ]
        },
        views: {}
      }
    }
    expect(store.getViewEntities(state, 'TEST_VIEW')).toEqual([])
  })

  it('getViewEntities selector returns empty array view entities are not in the state', () => {
    const routine = createAsyncRoutine('TEST_ROUTINE')
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user',
      views: [
        { name: 'TEST_VIEW', routine }
      ]
    })
    store.initialize('stuff')
    const state = {
      stuff: {
        entities: {
          user: [
            { uuid: '1' },
            { uuid: '2' }
          ]
        },
        views: {
          TEST_VIEW: {}
        }
      }
    }
    expect(store.getViewEntities(state, 'TEST_VIEW')).toEqual([])
  })

  it('getViewProps selector returns view props', () => {
    const routine = createAsyncRoutine('TEST_ROUTINE')
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user',
      views: [
        { name: 'TEST_VIEW', routine }
      ]
    })
    store.initialize('stuff')
    const state = {
      stuff: {
        entities: {
          user: [
            { uuid: '1' },
            { uuid: '2' }
          ]
        },
        views: {
          TEST_VIEW: {
            props: {
              foo: 'bar'
            }
          }
        }
      }
    }
    expect(store.getViewProps(state, 'TEST_VIEW')).toEqual({
      foo: 'bar'
    })
  })

  it('getViewProps returns empty props given props are missing in view state', () => {
    const routine = createAsyncRoutine('TEST_ROUTINE')
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user',
      views: [
        { name: 'TEST_VIEW', routine }
      ]
    })
    store.initialize('stuff')
    const state = {
      stuff: {
        entities: {
          user: [
            { uuid: '1' },
            { uuid: '2' }
          ]
        },
        views: {
          TEST_VIEW: {}
        }
      }
    }
    expect(store.getViewProps(state, 'TEST_VIEW')).toEqual({})
  })

  it('getViewProps returns empty props given view is missing in state', () => {
    const routine = createAsyncRoutine('TEST_ROUTINE')
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user',
      views: [
        { name: 'TEST_VIEW', routine }
      ]
    })
    store.initialize('stuff')
    const state = {
      stuff: {
        entities: {
          user: [
            { uuid: '1' },
            { uuid: '2' }
          ]
        },
        views: {}
      }
    }
    expect(store.getViewProps(state, 'TEST_VIEW')).toEqual({})
  })
})

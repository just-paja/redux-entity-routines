import { connectReducers, createEntityStore, createAsyncRoutine } from '..'

describe('store', () => {
  it('stores empty array by default', () => {
    const routine = createAsyncRoutine('TEST')
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const connected = connectReducers(null, store)
    expect(connected.entities(undefined, routine.success())).toEqual({
      user: []
    })
  })

  it('stores entities on collectionName path', () => {
    const routine = createAsyncRoutine('TEST')
    const store = createEntityStore({
      name: 'user',
      identSource: 'uuid',
      providedBy: [routine]
    })
    const connected = connectReducers(null, store)
    expect(connected.entities(undefined, routine.success([
      { uuid: '3' },
      { uuid: '4' }
    ]))).toHaveProperty('user', [
      { uuid: '3' },
      { uuid: '4' }
    ])
  })
})

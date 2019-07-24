import { createEntityStore } from '..'

describe('store', () => {
  it('store converts to readable string', () => {
    const store = createEntityStore('user', {
      identAttr: 'id'
    })
    expect(store + '').toEqual('EntityStore(user)')
  })

  it('createFindSelector returns item via ident selector', () => {
    const store = createEntityStore('user', {
      identAttr: 'id'
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
    const store = createEntityStore('user', {
      identAttr: 'id'
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
    const store = createEntityStore('user', {
      identAttr: 'id'
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
})

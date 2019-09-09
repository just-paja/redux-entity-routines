import { createView } from '../..'
import { views } from '..'

describe('views', () => {
  it('creates initial state', () => {
    expect(views()).toEqual({})
  })

  it('returns previous state on trigger', () => {
    const view = createView('USER_LIST')
    const state = {}
    const result = views(state, view.trigger([
      {
        uuid: '16ba900f-20b1-4061-8770-53a8c520913c',
        name: 'James Tiberius Kirk'
      }
    ]))
    expect(result).toBe(state)
  })

  it('returns previous state on request', () => {
    const view = createView('USER_LIST')
    const state = {}
    const result = views(state, view.request([
      {
        uuid: '16ba900f-20b1-4061-8770-53a8c520913c',
        name: 'James Tiberius Kirk'
      }
    ]))
    expect(result).toBe(state)
  })

  it('returns previous state on failure', () => {
    const view = createView('USER_LIST')
    const state = {}
    const result = views(state, view.failure([
      {
        uuid: '16ba900f-20b1-4061-8770-53a8c520913c',
        name: 'James Tiberius Kirk'
      }
    ]))
    expect(result).toBe(state)
  })

  it('returns previous state on fulfill', () => {
    const view = createView('USER_LIST')
    const state = {}
    const result = views(state, view.fulfill([
      {
        uuid: '16ba900f-20b1-4061-8770-53a8c520913c',
        name: 'James Tiberius Kirk'
      }
    ]))
    expect(result).toBe(state)
  })

  it('stores entity links on view success', () => {
    const view = createView('USER_LIST')
    const state = {}
    const result = views(state, view.success([
      {
        uuid: '16ba900f-20b1-4061-8770-53a8c520913c',
        name: 'James Tiberius Kirk'
      },
      {
        uuid: '82c7b6ea-ff3a-490c-8197-9d5cde615c9d',
        name: 'Spock'
      }
    ]))
    expect(result).toHaveProperty('userList.entities', [
      '16ba900f-20b1-4061-8770-53a8c520913c',
      '82c7b6ea-ff3a-490c-8197-9d5cde615c9d'
    ])
  })
})

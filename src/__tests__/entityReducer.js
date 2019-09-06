import { createEntityReducer, createAsyncRoutine } from '..'

describe('entity reducer', () => {
  function returnPayload (state, action) {
    return action.payload
  }

  it('returns previous state given action is not recognized', () => {
    const routine = createAsyncRoutine('TEST')
    const reducer = createEntityReducer({})
    const state = [
      { uuid: 'x3', name: 'foo' }
    ]
    expect(reducer(state, routine.success())).toBe(state)
  })

  it('returns empty array given action success is in clearedBy routines', () => {
    const routine = createAsyncRoutine('TEST')
    const reducer = createEntityReducer({
      clearedBy: [routine]
    })
    const state = [
      { uuid: 'x3', name: 'foo' }
    ]
    expect(reducer(state, routine.success())).toEqual([])
  })

  it('deletes item given payload string item exists', () => {
    const routine = createAsyncRoutine('TEST')
    const reducer = createEntityReducer({
      deletedBy: [routine]
    })
    const state = [
      { uuid: 'x3', name: 'foo' },
      { uuid: 'x9', name: 'baz' }
    ]
    expect(reducer(state, routine.success('x9'))).toEqual([
      { uuid: 'x3', name: 'foo' }
    ])
  })

  it('modifies collection when it receives collection reducer action', () => {
    const routine = createAsyncRoutine('TEST')
    const reducer = createEntityReducer({
      collectionReducers: {
        [routine.SUCCESS]: jest.fn().mockImplementation(returnPayload)
      }
    })
    const state = [
      { uuid: 'x3', name: 'foo', description: 'xxx' }
    ]
    expect(reducer(state, routine.success([{ uuid: 'x1' }]))).toEqual([
      { uuid: 'x1' }
    ])
  })

  it('modifies item when it receives "on" action', () => {
    const routine = createAsyncRoutine('TEST')
    const reducer = createEntityReducer({
      on: {
        [routine.SUCCESS]: jest.fn().mockImplementation(returnPayload)
      }
    })
    const state = [
      { uuid: 'x3' }
    ]
    expect(reducer(state, routine.success([{ uuid: 'x3', name: 'foo', description: 'xxx' }]))).toEqual([
      { uuid: 'x3', name: 'foo', description: 'xxx' }
    ])
  })
})

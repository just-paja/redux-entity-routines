import { createAsyncRoutine } from '../../routines'
import { operations } from '..'

describe('operations reducer', () => {
  it('returns empty object as initial state', () => {
    expect(operations(undefined, { type: 'TEST' })).toEqual({})
  })

  it('returns previous state given action type is not recognized', () => {
    const state = {}
    expect(operations(state, { type: 'TEST' })).toBe(state)
  })

  it('returns previous state given action type is trigger', () => {
    const state = {}
    expect(operations(state, { type: 'TEST/TRIGGER' })).toBe(state)
  })

  it('returns loading state on request given operation does not exist', () => {
    const state = {}
    const routine = createAsyncRoutine('TEST')
    expect(operations(state, routine.request())).toHaveProperty('TEST.loading', true)
  })

  it('returns loading state on request given operation exists', () => {
    const state = {
      TEST: {
        error: null,
        initialized: false,
        loading: false
      }
    }
    const routine = createAsyncRoutine('TEST')
    expect(operations(state, routine.request())).toHaveProperty('TEST.loading', true)
  })

  it('returns loading state on request given operation exists and has error', () => {
    const state = {
      TEST: {
        error: new Error('Test!'),
        initialized: false,
        loading: false
      }
    }
    const routine = createAsyncRoutine('TEST')
    expect(operations(state, routine.request())).toHaveProperty('TEST', expect.objectContaining({
      error: null,
      loading: true
    }))
  })

  it('returns initialized state on success given operation does not exists', () => {
    const state = {}
    const routine = createAsyncRoutine('TEST')
    expect(operations(state, routine.success())).toHaveProperty('TEST', expect.objectContaining({
      initialized: true
    }))
  })

  it('returns initialized state on success given operation exists', () => {
    const state = {
      TEST: {
        error: null,
        initialized: false,
        loading: false
      }
    }
    const routine = createAsyncRoutine('TEST')
    expect(operations(state, routine.success())).toHaveProperty('TEST', expect.objectContaining({
      initialized: true
    }))
  })

  it('returns not loading state on fulfill given operation does not exists', () => {
    const state = {}
    const routine = createAsyncRoutine('TEST')
    expect(operations(state, routine.fulfill())).toHaveProperty('TEST', expect.objectContaining({
      loading: false
    }))
  })

  it('returns not loading state on fulfill given operation exists', () => {
    const state = {
      TEST: {
        error: null,
        initialized: false,
        loading: true
      }
    }
    const routine = createAsyncRoutine('TEST')
    expect(operations(state, routine.fulfill())).toHaveProperty('TEST', expect.objectContaining({
      loading: false
    }))
  })

  it('returns failed state on failure given operation does not exists', () => {
    const state = {}
    const routine = createAsyncRoutine('TEST')
    const error = new Error('Test!')
    expect(operations(state, routine.failure(error))).toHaveProperty('TEST', expect.objectContaining({
      error
    }))
  })

  it('returns failed state on failure given operation exists', () => {
    const state = {
      TEST: {
        error: null,
        initialized: false,
        loading: true
      }
    }
    const routine = createAsyncRoutine('TEST')
    const error = new Error('Test!')
    expect(operations(state, routine.failure(error))).toHaveProperty('TEST', expect.objectContaining({
      error
    }))
  })
})

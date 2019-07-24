import { createAsyncRoutine } from '..'

describe('routines', () => {
  it('getState returns routine state given it exists', () => {
    const routine = createAsyncRoutine('TEST')
    const state = {
      operations: {
        TEST: {
          error: null,
          initialized: false,
          loading: false
        }
      }
    }
    expect(routine.getState(state)).toEqual({
      error: null,
      initialized: false,
      loading: false
    })
  })

  it('getState returns null given it does not exist', () => {
    const routine = createAsyncRoutine('TEST')
    const state = {
      operations: {}
    }
    expect(routine.getState(state)).toEqual(null)
  })

  it('getError returns null given operation does not exist', () => {
    const routine = createAsyncRoutine('TEST')
    const state = {
      operations: {}
    }
    expect(routine.getError(state)).toEqual(null)
  })

  it('getError returns null given error is null', () => {
    const routine = createAsyncRoutine('TEST')
    const state = {
      operations: {
        TEST: {
          error: null
        }
      }
    }
    expect(routine.getError(state)).toEqual(null)
  })

  it('getError returns stored error', () => {
    const routine = createAsyncRoutine('TEST')
    const error = new Error('Test!')
    const state = {
      operations: {
        TEST: {
          error
        }
      }
    }
    expect(routine.getError(state)).toBe(error)
  })

  it('isInitialized returns false given operation does not exist', () => {
    const routine = createAsyncRoutine('TEST')
    const state = {
      operations: {}
    }
    expect(routine.isInitialized(state)).toBe(false)
  })

  it('isInitialized returns false given operation was not initialized', () => {
    const routine = createAsyncRoutine('TEST')
    const state = {
      operations: {
        TEST: {
          initialized: false
        }
      }
    }
    expect(routine.isInitialized(state)).toBe(false)
  })

  it('isInitialized returns true given operation was initialized', () => {
    const routine = createAsyncRoutine('TEST')
    const state = {
      operations: {
        TEST: {
          initialized: true
        }
      }
    }
    expect(routine.isInitialized(state)).toBe(true)
  })

  it('isLoading returns false given operation does not exist', () => {
    const routine = createAsyncRoutine('TEST')
    const state = {
      operations: {}
    }
    expect(routine.isLoading(state)).toBe(false)
  })

  it('isLoading returns false given operation is not loading', () => {
    const routine = createAsyncRoutine('TEST')
    const state = {
      operations: {
        TEST: {
          loading: false
        }
      }
    }
    expect(routine.isLoading(state)).toBe(false)
  })

  it('isLoading returns true given operation is loading', () => {
    const routine = createAsyncRoutine('TEST')
    const state = {
      operations: {
        TEST: {
          loading: true
        }
      }
    }
    expect(routine.isLoading(state)).toBe(true)
  })
})

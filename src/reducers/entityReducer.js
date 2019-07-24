import { modify } from './modify'
import { remove } from './remove'
import { upsert } from './upsert'

function isActionInRoutines (routines, action) {
  return routines && routines.some(routine => routine.sync
    ? routine.TRIGGER === action.type
    : routine.SUCCESS === action.type
  )
}

function isActionRecognized (on, action) {
  return on && Object.keys(on).indexOf(action.type) !== -1
}

function configure (reducerOptions) {
  return {
    identAttr: 'uuid',
    ...reducerOptions
  }
}

export function createEntityReducer (config) {
  const {
    clearedBy,
    deletedBy,
    on,
    collectionReducers,
    providedBy,
    ...reducerOptions
  } = config
  const reducerConfig = configure(reducerOptions)
  return function entityReducer (state = [], action) {
    if (isActionRecognized(collectionReducers, action)) {
      return collectionReducers[action.type](state, action, reducerConfig)
    }
    if (isActionInRoutines(providedBy, action)) {
      return upsert(state, action, reducerConfig)
    }
    if (isActionRecognized(on, action)) {
      return modify(state, action, { ...reducerConfig, reducer: on[action.type] })
    }
    if (isActionInRoutines(deletedBy, action)) {
      return remove(state, action, reducerConfig)
    }
    if (isActionInRoutines(clearedBy, action)) {
      return []
    }
    return state
  }
}

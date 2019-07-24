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

export function createEntityReducer (config) {
  const {
    clearedBy,
    deletedBy,
    on,
    collectionReducers,
    providedBy,
    ...reducerOptions
  } = config
  return function entityReducer (state = [], action) {
    if (isActionRecognized(collectionReducers, action)) {
      return collectionReducers[action.type](state, action, reducerOptions)
    }
    if (isActionInRoutines(providedBy, action)) {
      return upsert(state, action, reducerOptions)
    }
    if (isActionRecognized(on, action)) {
      return modify(state, action, { ...reducerOptions, reducer: on[action.type] })
    }
    if (isActionInRoutines(deletedBy, action)) {
      return remove(state, action, reducerOptions)
    }
    if (isActionInRoutines(clearedBy, action)) {
      return []
    }
    return state
  }
}

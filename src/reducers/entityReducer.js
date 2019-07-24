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
    if (isActionInRoutines(clearedBy, action)) {
      return []
    }
    let nextState = state
    if (isActionRecognized(collectionReducers, action)) {
      nextState = collectionReducers[action.type](nextState, action, reducerOptions)
    }
    if (isActionInRoutines(providedBy, action)) {
      nextState = upsert(nextState, action, reducerOptions)
    }
    if (isActionRecognized(on, action)) {
      nextState = modify(nextState, action, { ...reducerOptions, reducer: on[action.type] })
    }
    if (isActionInRoutines(deletedBy, action)) {
      nextState = remove(nextState, action, reducerOptions)
    }
    return nextState
  }
}

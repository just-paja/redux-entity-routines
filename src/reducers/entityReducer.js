import { createModifyReducer } from './modify'
import { remove } from './remove'
import { upsert } from './upsert'

function isActionInRoutines (routines, action) {
  return routines && routines.some(routine => routine.sync
    ? routine.TRIGGER === action.type
    : routine.SUCCESS === action.type
  )
}

function isActionReflected (on, action) {
  return on && Object.keys(on).indexOf(action.type) !== -1
}

function isActionRecognized (collection, action) {
  return collection instanceof Array
    ? isActionInRoutines(collection, action)
    : isActionReflected(collection, action)
}

function empty () {
  return []
}

function reduceModifyReducer (reducers) {
  return function (acc, key) {
    return { ...acc, [key]: createModifyReducer(reducers[key]) }
  }
}

function getModifyReducers (reducers) {
  return reducers
    ? Object.keys(reducers).reduce(reduceModifyReducer(reducers), {})
    : null
}

export function createEntityReducer ({
  clearedBy,
  deletedBy,
  on,
  collectionReducers,
  providedBy,
  ...reducerOptions
}) {
  const itemReducers = getModifyReducers(on)
  function getReducerSequence (action) {
    return [
      isActionRecognized(clearedBy, action) && empty,
      isActionRecognized(collectionReducers, action) && collectionReducers[action.type],
      isActionRecognized(providedBy, action) && upsert,
      isActionRecognized(itemReducers, action) && itemReducers[action.type],
      isActionRecognized(deletedBy, action) && remove
    ].filter(item => item)
  }
  return function entityReducer (state = [], action) {
    return getReducerSequence(action).reduce(
      (acc, reducer) => reducer(acc, action, reducerOptions),
      state
    )
  }
}

import { createModifyReducer } from './modify'
import { remove } from './remove'
import { upsert } from './upsert'

function getActionWithRoutine (routines, action) {
  const routine = routines && routines.some(routine => routine.sync
    ? routine.TRIGGER === action.type
    : routine.SUCCESS === action.type
  )
  if (routine) {
    return { ...action, routine }
  }
  return null
}

function isActionReflected (on, action) {
  return on && Object.keys(on).indexOf(action.type) !== -1
}

function isActionRecognized (collection, action) {
  return collection instanceof Array
    ? getActionWithRoutine(collection, action)
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

export function createEntityReducer (config) {
  const itemReducers = getModifyReducers(config.on)
  function getReducerSequence (action) {
    return [
      isActionRecognized(config.clearedBy, action) && empty,
      isActionRecognized(config.collectionReducers, action) && config.collectionReducers[action.type],
      isActionRecognized(config.providedBy, action) && upsert,
      isActionRecognized(itemReducers, action) && itemReducers[action.type],
      isActionRecognized(config.deletedBy, action) && remove
    ].filter(item => item)
  }
  return function entityReducer (state = [], action) {
    return getReducerSequence(action).reduce(
      (acc, reducer) => reducer(acc, action, config),
      state
    )
  }
}

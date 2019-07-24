import { composeActionType, createActionCreator } from './actions'
import { createOperationSelector, getOperationProp } from './selectors'

import camelCase from 'camelcase'

export function createRoutine (baseName) {
  const routine = createActionCreator(baseName)
  routine.routineName = baseName
  return routine
}

export function createSyncRoutine (baseName) {
  const routine = createRoutine(baseName)
  routine.trigger = routine
  routine.TRIGGER = baseName
  routine.sync = true
  return routine
}

export function createAsyncRoutine (baseName) {
  const TRIGGER = composeActionType(baseName, 'TRIGGER')
  const routine = createRoutine(TRIGGER)

  routine.trigger = routine
  routine.TRIGGER = TRIGGER
  routine.FAILURE = composeActionType(baseName, 'FAILURE')
  routine.failure = createActionCreator(routine.FAILURE)
  routine.FULFILL = composeActionType(baseName, 'FULFILL')
  routine.fulfill = createActionCreator(routine.FULFILL)
  routine.REQUEST = composeActionType(baseName, 'REQUEST')
  routine.request = createActionCreator(routine.REQUEST)
  routine.SUCCESS = composeActionType(baseName, 'SUCCESS')
  routine.success = createActionCreator(routine.SUCCESS)

  const getOperationState = createOperationSelector(baseName)
  routine.getState = getOperationState
  routine.getError = getOperationProp(getOperationState, 'error')
  routine.isInitialized = getOperationProp(getOperationState, 'initialized')
  routine.isLoading = getOperationProp(getOperationState, 'loading')

  return routine
}

function reduceRoutinesToDict (entity, sync) {
  return function (acc, routine) {
    const routineName = routine.toUpperCase()
    const baseName = composeActionType(entity, routineName)
    const result = {
      ...acc,
      [camelCase(routine)]: sync
        ? createSyncRoutine(baseName)
        : createAsyncRoutine(baseName)
    }
    if (sync) {
      result[routineName] = baseName
    }
    return result
  }
}

export function createEntityRoutines (entity, routines, sync) {
  return routines.reduce(reduceRoutinesToDict(entity, sync), {})
}

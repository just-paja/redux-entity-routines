import camelCase from 'camelcase'

function composeActionType (baseName, actionType) {
  return `${baseName}/${actionType}`
}

function createAction (actionName) {
  return function (payload, meta) {
    return {
      type: actionName,
      meta,
      payload
    }
  }
}

export function createRoutine (baseName) {
  const TRIGGER = composeActionType(baseName, 'TRIGGER')
  const trigger = createAction(TRIGGER)
  trigger.trigger = trigger
  trigger.TRIGGER = TRIGGER
  trigger.FAILURE = composeActionType(baseName, 'FAILURE')
  trigger.failure = createAction(trigger.FAILURE)
  trigger.FULFILL = composeActionType(baseName, 'FULFILL')
  trigger.fulfill = createAction(trigger.FULFILL)
  trigger.REQUEST = composeActionType(baseName, 'REQUEST')
  trigger.request = createAction(trigger.REQUEST)
  trigger.SUCCESS = composeActionType(baseName, 'SUCCESS')
  trigger.success = createAction(trigger.SUCCESS)
  return trigger
}

export function createSyncRoutine (baseName) {
  const TRIGGER = baseName
  const trigger = createAction(TRIGGER)
  trigger.TRIGGER = TRIGGER
  return trigger
}

function reduceRoutinesToDict (entity, sync) {
  return function (acc, routine) {
    const routineName = routine.toUpperCase()
    const baseName = `${entity.toUpperCase()}/${routineName}`
    const result = {
      ...acc,
      [camelCase(routine)]: sync
        ? createSyncRoutine(baseName)
        : createRoutine(baseName)
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

import { ACTION_PATH_SEPARATOR } from './constants'

export function composeActionType (baseName, actionType) {
  return `${baseName.toUpperCase()}${ACTION_PATH_SEPARATOR}${actionType.toUpperCase()}`
}

export function createActionCreator (actionName) {
  return function actionCreator (payload, meta) {
    return {
      type: actionName,
      meta,
      payload
    }
  }
}

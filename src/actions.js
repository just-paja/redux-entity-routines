export function composeActionType (baseName, actionType) {
  return `${baseName.toUpperCase()}/${actionType.toUpperCase()}`
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

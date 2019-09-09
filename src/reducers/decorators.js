import jp from 'jsonpath'

export function parseEntityPath (reducer, srcConfig) {
  return function (state, action, currentConfig) {
    const config = srcConfig || currentConfig
    const path = config.getRoutineEntityPath(action)
    const formattedAction = path
      ? { ...action, payload: jp.value(action.payload, path) }
      : action
    return reducer(state, formattedAction, currentConfig)
  }
}

export function reduceArray (reducer) {
  return function (state, action, config) {
    if (action.payload instanceof Array) {
      return action.payload.reduce(
        function (acc, payload) {
          return reducer(acc, { ...action, payload }, config)
        },
        state
      )
    }
    return reducer(state, action, config)
  }
}

export function requireIdent (reducer) {
  return function (state, action, config) {
    const ident = config.getIdentifier(action.payload)
    return ident
      ? reducer(state, action, config, ident)
      : state
  }
}

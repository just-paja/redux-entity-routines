import { getIdentifier } from './identifiers'

export function reduceArray (reducer) {
  return function (state, action, config) {
    if (action.payload instanceof Array) {
      return action.payload.reduce(
        function (acc, payload) {
          return reducer(acc, { payload }, config)
        },
        state
      )
    }
    return reducer(state, action, config)
  }
}

export function requireIdent (reducer) {
  return function (state, action, config) {
    const ident = getIdentifier(action.payload, config.identAttr)
    return ident
      ? reducer(state, action, config, ident)
      : state
  }
}

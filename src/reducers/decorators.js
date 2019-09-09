import { getPayloadEntities } from './payloadEntities'

export function reduceArray (reducer) {
  return function (state, action, config) {
    const payload = getPayloadEntities(config.name, action)
    if (payload instanceof Array) {
      return payload.reduce(
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
    const payload = getPayloadEntities(config.name, action)
    const ident = config.getIdentifier(payload)
    return ident
      ? reducer(state, action, config, ident)
      : state
  }
}

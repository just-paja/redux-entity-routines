import { reduceArray, requireIdent } from './decorators'
import { getItemIndex } from './identifiers'

function processEntity (config, entity) {
  if (config.entityProcessors && config.entityProcessors.length) {
    return config.entityProcessors.reduce((acc, processor) => processor(acc), entity)
  }
  return entity
}

export const upsert = reduceArray(requireIdent(function (state, action, config, ident) {
  const itemIndex = getItemIndex(state, config, ident)
  if (itemIndex === -1) {
    return [
      ...state,
      processEntity(config, {
        ...config.initialState,
        ...action.payload,
        [config.identAttr]: ident
      })
    ]
  }
  const nextState = state.slice()
  nextState[itemIndex] = processEntity(config, action.payload)
  return nextState
}))

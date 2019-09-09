import { getItemIndex } from './identifiers'
import { reduceArray, requireIdent, parseEntityPath } from './decorators'

function processEntity (config, entity) {
  if (config.entityProcessors && config.entityProcessors.length) {
    return config.entityProcessors.reduce((acc, processor) => processor(acc), entity)
  }
  return entity
}

export function upsertItem (state, action, config, itemIndex) {
  const payload = action.payload
  if (itemIndex === -1) {
    return [
      ...state,
      processEntity(config, config.formatEntity(payload))
    ]
  }
  const nextState = state.slice()
  nextState[itemIndex] = processEntity(config, payload)
  return nextState
}

export const upsert = parseEntityPath(
  reduceArray(
    requireIdent(function (state, action, config, ident) {
      return upsertItem(state, action, config, getItemIndex(state, config, ident))
    })))

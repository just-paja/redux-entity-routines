import { upsertItem } from './upsert'
import { getItemIndex } from './identifiers'
import { getPayloadEntities } from './payloadEntities'
import { reduceArray, requireIdent } from './decorators'

export function createModifyReducer (reducer) {
  if (!reducer) {
    throw new Error('You must pass reducer function to the modify reducer')
  }
  return reduceArray(requireIdent(function (state, action, config, ident) {
    const itemIndex = getItemIndex(state, config, ident)
    const actionPayload = getPayloadEntities(config.name, action)
    const item = itemIndex === -1
      ? config.formatEntity(actionPayload)
      : state[itemIndex]
    const payload = reducer(item, action)
    return upsertItem(state, { payload }, config, itemIndex)
  }))
}

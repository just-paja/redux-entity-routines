import { getItemIndex } from './identifiers'
import { reduceArray, requireIdent } from './decorators'
import { constructItem, upsertItem } from './upsert'

export function createModifyReducer (reducer) {
  if (!reducer) {
    throw new Error('You must pass reducer function to the modify reducer')
  }
  return reduceArray(requireIdent(function (state, action, config, ident) {
    const itemIndex = getItemIndex(state, config, ident)
    const item = itemIndex === -1
      ? constructItem(config, action.payload)
      : state[itemIndex]
    const payload = reducer(item, action)
    return upsertItem(state, { payload }, config, itemIndex)
  }))
}

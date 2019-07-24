import { getItemIndex } from './identifiers'
import { reduceArray, requireIdent } from './decorators'
import { upsertItem } from './upsert'

export function createModifyReducer (reducer) {
  if (!reducer) {
    throw new Error('You must pass reducer function to the modify reducer')
  }
  return reduceArray(requireIdent(function (state, action, config, ident) {
    const itemIndex = getItemIndex(state, config, ident)
    const payload = reducer(state[itemIndex], action)
    return upsertItem(state, { payload }, config, itemIndex)
  }))
}

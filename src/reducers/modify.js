import { getItemIndex } from './identifiers'
import { reduceArray, requireIdent } from './decorators'
import { upsertItem } from './upsert'

export const modify = reduceArray(requireIdent(function (state, action, config, ident) {
  const { reducer } = config
  if (!reducer) {
    throw new Error('You must pass reducer function to the modify reducer')
  }
  const itemIndex = getItemIndex(state, config, ident)
  const payload = reducer(state[itemIndex], action)
  return upsertItem(state, { payload }, config, ident, itemIndex)
}))

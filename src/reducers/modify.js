import { reduceArray, requireIdent } from './decorators'
import { getItemIndex } from './identifiers'
import { filterAttrs } from './attrs'

export const modify = reduceArray(requireIdent(function (state, action, config, ident) {
  const { identAttr, reducer, ignoreAttrs } = config
  if (!reducer) {
    throw new Error('You must pass reducer function to the modify reducer')
  }
  const itemIndex = getItemIndex(state, config, ident)
  const item = state[itemIndex]
  const result = filterAttrs(ignoreAttrs, {
    ...reducer(item, action),
    [identAttr]: ident
  })

  if (itemIndex === -1) {
    return [...state, result]
  }

  const nextState = state.slice()
  nextState[itemIndex] = result
  return nextState
}))

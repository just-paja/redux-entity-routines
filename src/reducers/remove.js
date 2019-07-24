import { reduceArray, requireIdent } from './decorators'
import { getItemIndex } from './identifiers'

export const remove = reduceArray(requireIdent(function (state, action, config, ident) {
  const itemIndex = getItemIndex(state, config, ident)
  if (itemIndex === -1) {
    return state
  }
  const nextState = state.slice()
  nextState.splice(itemIndex, 1)
  return nextState
}))

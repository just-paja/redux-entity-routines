import { createSelector } from 'reselect'
import { STORE_OPERATIONS } from './constants'

export function getFirstSelectorArg (state, arg1) {
  return arg1
}

export function getSecondSelectorArg (state, arg1, arg2) {
  return arg2
}

export function getProp (item, prop) {
  return item ? item[prop] : null
}

export function getFlag (value) {
  return Boolean(value)
}

function getOperationsState (state) {
  return state[STORE_OPERATIONS]
}

export function createOperationSelector (operationName) {
  return createSelector(
    getOperationsState,
    operations => operations[operationName] || null
  )
}

export function getOperationProp (getOperation, prop) {
  return createSelector(getOperation, () => prop, getProp)
}

export function getOperationFlag (getOperation, prop) {
  return createSelector(getOperationProp(getOperation, prop), getFlag)
}

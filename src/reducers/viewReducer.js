import { ACTION_PATH_SEPARATOR, STAGE_SUCCESS, VIEW_PREFIX } from '../constants'
import { requireStage } from './operationReducer'

import camelCase from 'camelcase'

const initialState = {}

function getViewName (action) {
  if (action.type.indexOf(VIEW_PREFIX) === 0) {
    const actionPath = action.type.substr(VIEW_PREFIX.length + 1).split(ACTION_PATH_SEPARATOR)
    return actionPath[0] ? camelCase(actionPath[0]) : null
  }
  return null
}

function requireSuccess (reducer) {
  return function (state = initialState, action, stage) {
    return stage === STAGE_SUCCESS ? reducer(state, action) : state
  }
}

function requireViewName (reducer) {
  return function (state = initialState, action) {
    const viewName = getViewName(action)
    return viewName ? reducer(state, action, viewName) : state
  }
}

export const views = requireStage(requireSuccess(requireViewName(function (state = initialState, action, viewName) {
  return {
    ...state,
    [viewName]: {
      entities: []
    }
  }
})))

// function createViewReducer (mountPoint, ...stores) {
//   return combineReducers(createViews(stores).reduce((acc, reducer) => ({
//     ...acc,
//     [reducer.name]: reducer
//   })))
// }

export function createViewsReducer (mountPoint, ...stores) {
  return state => state
}

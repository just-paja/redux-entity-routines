import { combineReducers } from 'redux'

import jp from 'jsonpath'

const viewInitialState = {
  entities: [],
  props: {}
}

function getIdents (config, payload) {
  const payloadArray = payload instanceof Array ? payload : [payload]
  return payloadArray.map(item => config.getIdentifier(item))
}

function createViewReducer (store, viewConfig) {
  return function (state = viewInitialState, action) {
    if (action.type !== viewConfig.routine.SUCCESS) {
      return state
    }
    const path = store.config.getRoutineEntityPath(action)
    const entities = getIdents(store.config, path ? jp.value(action.payload, path) : action.payload)
    return {
      entities,
      props: viewConfig.props
        ? Object.keys(viewConfig.props).reduce((acc, key) => ({
          ...acc,
          [key]: jp.value(action.payload, viewConfig.props[key])
        }), {})
        : null
    }
  }
}

function createViewReducers (store) {
  return store.config.views.reduce((acc, viewConfig) => ({
    ...acc,
    [viewConfig.name]: createViewReducer(store, viewConfig)
  }), {})
}

export function createViewsReducer (mountPoint, ...stores) {
  const viewReducers = stores
    .filter(store => store.config.views)
    .reduce((acc, store) => ({ ...acc, ...createViewReducers(store) }), {})

  return Object.keys(viewReducers).length > 0
    ? combineReducers(viewReducers)
    : null
}

import { STAGES_ASYNC, STAGE_FAILURE, STAGE_FULFILL, STAGE_REQUEST, STAGE_SUCCESS } from '../constants'

const initialState = {
  error: null,
  initialized: false,
  loading: false
}

function filterStage (actionType) {
  return function (stage) {
    return actionType.indexOf(stage) === actionType.length - stage.length
  }
}

function getStage (actionType) {
  return STAGES_ASYNC.find(filterStage(actionType))
}

function getBaseName (actionType, stage) {
  return actionType.substr(0, actionType.length - stage.length - 1)
}

function updateOperation (state, action, baseName, reducer) {
  return {
    ...state,
    [baseName]: reducer(state[baseName] || initialState, action)
  }
}

function startLoading (state) {
  return { ...state, error: null, loading: true }
}

function stopLoading (state) {
  return { ...state, loading: false }
}

function initialize (state) {
  return { ...state, initialized: true }
}

function fail (state, action) {
  return { ...state, error: action.payload }
}

export function operations (state = {}, action) {
  const stage = getStage(action.type)

  if (!stage) {
    return state
  }

  const baseName = getBaseName(action.type, stage)

  if (stage === STAGE_REQUEST) {
    return updateOperation(state, action, baseName, startLoading)
  }
  if (stage === STAGE_SUCCESS) {
    return updateOperation(state, action, baseName, initialize)
  }
  if (stage === STAGE_FULFILL) {
    return updateOperation(state, action, baseName, stopLoading)
  }
  if (stage === STAGE_FAILURE) {
    return updateOperation(state, action, baseName, fail)
  }
  return state
}

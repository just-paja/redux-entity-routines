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

function reduceOperation (state, action, baseName, reducer) {
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

const operationMap = {
  [STAGE_FAILURE]: fail,
  [STAGE_FULFILL]: stopLoading,
  [STAGE_REQUEST]: startLoading,
  [STAGE_SUCCESS]: initialize
}

export function requireStage (reducer) {
  return function (state = {}, action) {
    const stage = action.type && getStage(action.type)
    return stage ? reducer(state, action, stage) : state
  }
}

function requireStageReducer (reducer) {
  return function (state, action, stage) {
    const stageReducer = operationMap[stage]
    return stageReducer ? reducer(state, action, stage, stageReducer) : state
  }
}

export const operations = requireStage(requireStageReducer(function (
  state,
  action,
  stage,
  stageReducer
) {
  return reduceOperation(state, action, getBaseName(action.type, stage), stageReducer)
}))

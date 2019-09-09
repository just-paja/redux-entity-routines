import { combineReducers } from 'redux'
import { createBelongsTo } from './BelongsTo'
import { createManyToMany } from './ManyToMany'
import { createViewsReducer } from './reducers/viewReducer'
import { operations } from './reducers/operationReducer'
import { STORE_ENTITIES, STORE_OPERATIONS, STORE_VIEWS } from './constants'

function connectEntitiesReducers (mountPoint, ...stores) {
  const manyToMany = createManyToMany(stores)
  const belongsTo = createBelongsTo(stores)
  const allStores = [
    ...stores
  ]
  manyToMany.forEach(relation => relation.configureStores())
  belongsTo.forEach(relation => relation.configureStores())
  allStores.forEach(store => store.initialize())
  return combineReducers(allStores.reduce((acc, store) => ({
    ...acc,
    [store.name]: store.reducer
  }), {}))
}

export function createEntitiesReducer (...stores) {
  return connectEntitiesReducers('entities', ...stores)
}

export function connectReducers (mountPoint, ...stores) {
  return {
    [STORE_ENTITIES]: connectEntitiesReducers(mountPoint, ...stores),
    [STORE_OPERATIONS]: operations,
    [STORE_VIEWS]: createViewsReducer(mountPoint, ...stores)
  }
}

import { combineReducers } from 'redux'
import { createManyToMany } from './ManyToMany'
import { createBelongsTo } from './BelongsTo'

export function createEntitiesReducer (...stores) {
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

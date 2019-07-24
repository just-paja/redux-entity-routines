import { Configurable } from './Configurable'
import { createEntityReducer, filterItem, filterUnique } from './reducers'
import { createSelector } from 'reselect'
import { createSyncRoutine } from './routines'
import {
  getFirstSelectorArg,
  getFlag,
  getProp,
  getSecondSelectorArg
} from './selectors'

function flat (arrays) {
  return arrays.reduce((acc, arr) => acc.concat(arr), [])
}

function mergeArrays (...args) {
  return flat(args).filter(item => item).filter(filterUnique)
}

class EntityStore extends Configurable {
  constructor (name, config) {
    super({ ...config, name })
    this.bind('findItem')
    this.bind('getAll')
    this.bind('getCollection')
    this.bind('getSize')
    this.bind('isEmpty')
    this.name = name

    this.getObject = createSelector(this.getCollection, getFirstSelectorArg, this.findItem)
    this.getProp = createSelector(this.getObject, getSecondSelectorArg, getProp)
    this.getFlag = createSelector(this.getProp, getFlag)
  }

  initialize () {
    this.createActions()
    this.createReducer()
  }

  createActions () {
    this.clear = createSyncRoutine(`${this.name.toUpperCase()}/CLEAR`)
    this.configure({ clearedBy: mergeArrays([this.clear], this.config.clearedBy) })
  }

  createReducer () {
    this.reducer = createEntityReducer(this.config)
  }

  findItem (items, ident) {
    return items.find(filterItem(this.config, ident)) || null
  }

  getCollection (state) {
    return state.entities[this.name]
  }

  getAll (state) {
    return this.getCollection(state)
  }

  createFindSelector (getIdent) {
    return createSelector(
      this.getCollection,
      getIdent,
      this.findItem
    )
  }

  getSize (state) {
    return this.getAll(state).length
  }

  isEmpty (state) {
    return this.getSize(state) === 0
  }

  toString () {
    return `EntityStore(${this.name})`
  }
}

export function createEntityStore (collectionName, config) {
  return new EntityStore(collectionName, config)
}

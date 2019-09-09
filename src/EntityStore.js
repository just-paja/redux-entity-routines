import { createEntityReducer, filterItem } from './reducers'
import { createSelector } from 'reselect'
import { EntityConfig } from './EntityConfig'
import { getFirstSelectorArg, getFlag, getProp, getSecondSelectorArg } from './selectors'
import { NamedObject } from './NamedObject'
import { STORE_ENTITIES } from './constants'

import jp from 'jsonpath'

class EntityStore extends NamedObject {
  constructor (config) {
    const entityConfig = config instanceof EntityConfig ? config : new EntityConfig(config)
    super(entityConfig.name)
    this.config = entityConfig
    this.findItem = this.findItem.bind(this)
    this.getAll = this.getAll.bind(this)
    this.getCollection = this.getCollection.bind(this)
    this.getSize = this.getSize.bind(this)
    this.isEmpty = this.isEmpty.bind(this)
    this.configureMountPoint()
    this.getObject = createSelector(this.getCollection, getFirstSelectorArg, this.findItem)
    this.getProp = createSelector(this.getObject, getSecondSelectorArg, getProp)
    this.getFlag = createSelector(this.getProp, getFlag)
  }

  initialize (mountPoint) {
    this.configureMountPoint(mountPoint)
    this.createReducer()
  }

  configureMountPoint (mountPoint) {
    this.mountPoint = [STORE_ENTITIES, mountPoint, this.name].filter(item => item).join('.')
  }

  createReducer () {
    this.reducer = createEntityReducer(this.config)
  }

  findItem (items, ident) {
    return items.find(filterItem(this.config, ident)) || null
  }

  getCollection (state) {
    return jp.value(state, this.mountPoint)
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

export function createEntityStore (...args) {
  return new EntityStore(...args)
}

import { createEntityReducer, filterItem } from './reducers'
import { createSelector } from 'reselect'
import { EntityConfig } from './EntityConfig'
import { getFirstSelectorArg, getFlag, getProp, getSecondSelectorArg } from './selectors'
import { NamedObject } from './NamedObject'
import { STORE_ENTITIES, STORE_VIEWS } from './constants'

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
    this.getView = this.getView.bind(this)
    this.getViewEntities = this.getViewEntities.bind(this)
    this.isEmpty = this.isEmpty.bind(this)
    this.configureMountPoint()
    this.getObject = createSelector(this.getCollection, getFirstSelectorArg, this.findItem)
    this.getProp = createSelector(this.getObject, getSecondSelectorArg, getProp)
    this.getFlag = createSelector(this.getProp, getFlag)
    this.getViewEntities = createSelector(this.getAll, this.getView, this.getViewEntities)
    this.getViewProps = createSelector(this.getView, this.getViewProps)
  }

  initialize (mountPoint) {
    this.configureMountPoint(mountPoint)
    this.createReducer()
  }

  configureMountPoint (mountPoint) {
    this.entitiesMountPoint = [mountPoint, STORE_ENTITIES, this.name].filter(item => item).join('.')
    this.viewsMountPoint = [mountPoint, STORE_VIEWS].filter(item => item).join('.')
  }

  createReducer () {
    this.reducer = createEntityReducer(this.config)
  }

  findItem (items, ident) {
    return items.find(filterItem(this.config, ident)) || null
  }

  getCollection (state) {
    return jp.value(state, this.entitiesMountPoint)
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

  getView (state, viewName) {
    if (this.config.hasView(viewName)) {
      return jp.value(state, [this.viewsMountPoint, viewName].join('.'))
    }
    throw new Error(`Entity "${this.config.name}" does not belong to view "${viewName}"`)
  }

  getViewEntities (entities, view) {
    const idents = (view && view.entities) || []
    return idents.map(ident => this.findItem(entities, ident)).filter(item => item)
  }

  getViewProps (view) {
    return (view && view.props) || {}
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

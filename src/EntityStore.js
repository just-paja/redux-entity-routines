import { createEntityReducer, filterItem } from './reducers'
import { createSelector } from 'reselect'
import { EntityConfig } from './EntityConfig'
import { getFirstSelectorArg, getFlag, getProp, getSecondSelectorArg } from './selectors'
import { NamedObject } from './NamedObject'
import { STORE_ENTITIES, STORE_VIEWS } from './constants'

import camelCase from 'camelcase'
import jp from 'jsonpath'

class EntityStore extends NamedObject {
  views = {}

  constructor (config) {
    const entityConfig = config instanceof EntityConfig ? config : new EntityConfig(config)
    super(entityConfig.name)
    this.config = entityConfig
    this.createViewSelector = this.createViewSelector.bind(this)
    this.findItem = this.findItem.bind(this)
    this.getAll = this.getAll.bind(this)
    this.getCollection = this.getCollection.bind(this)
    this.getSize = this.getSize.bind(this)
    this.getViewEntities = this.getViewEntities.bind(this)
    this.getViewProps = this.getViewProps.bind(this)
    this.isEmpty = this.isEmpty.bind(this)
    this.configureMountPoint()
    this.getObject = createSelector(this.getCollection, getFirstSelectorArg, this.findItem)
    this.getProp = createSelector(this.getObject, getSecondSelectorArg, getProp)
    this.getFlag = createSelector(this.getProp, getFlag)
    this.createViewsSelectors()
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

  createViewsSelectors () {
    if (!this.config.views) {
      return
    }
    this.views = this.config.views.reduce((acc, view) => ({
      ...acc,
      [camelCase(view.name)]: this.createViewSelectors(view)
    }), {})
  }

  createViewSelectors (view) {
    return {
      getEntities: createSelector(
        this.getAll,
        this.createViewSelector(view.name),
        this.getViewEntities
      ),
      getProps: createSelector(
        this.createViewSelector(view.name),
        this.getViewProps
      )
    }
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

  createViewSelector (viewName) {
    return createSelector(
      state => jp.value(state, this.viewsMountPoint),
      views => views[viewName]
    )
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

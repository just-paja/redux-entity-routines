import { append, extend, parseEntityPath, reduceArray, upsert } from './reducers'
import { Relation } from './Relation'

class BelongsTo extends Relation {
  get relationName () {
    return `belongsTo(${this.connection})`
  }

  get attr () {
    return this.config.attr
  }

  createUpsertReducers (src) {
    const attr = this.attr
    return src.config.providedBy.reduce((acc, routine) => ({
      ...acc,
      [routine.SUCCESS]: parseEntityPath(reduceArray(function (state, action, config) {
        const carrier = action.payload
        const payload = carrier[attr]
        return payload && typeof payload === 'object'
          ? upsert(state, { payload }, config)
          : state
      }), src.config)
    }), {})
  }

  createEntityProcessor (relatedStore) {
    const attr = this.attr
    return function (item) {
      const target = item[attr]
      return {
        ...item,
        [attr]: target instanceof Object ? relatedStore.config.getIdentifier(target) : target
      }
    }
  }

  configureStores () {
    if (this.parent.config.providedBy) {
      extend(this.target.config, 'collectionReducers', this.createUpsertReducers(this.parent))
    }
    append(this.parent.config, 'entityProcessors', this.createEntityProcessor(this.target))
  }
}

function getStoreByName (stores, storeName) {
  const result = stores.find(store => store.name === storeName)
  if (!result) {
    throw new Error(`Cannot find entity store called "${storeName}"`)
  }
  return result
}

export function createBelongsTo (stores) {
  return stores
    .filter(store => store.config.belongsTo)
    .reduce((acc, store) => [
      ...acc,
      ...store.config.belongsTo.map(config => new BelongsTo({
        attr: config.attr,
        parent: store,
        target: getStoreByName(stores, config.collection)
      }))
    ], [])
}

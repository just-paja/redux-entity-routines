import { append, extend, filterUnique, getItemIndex, parseEntityPath, reduceArray, upsert } from './reducers'
import { Relation } from './Relation'

class ManyToMany extends Relation {
  get relationName () {
    return `manyToMany(${this.connection})`
  }

  createUpsertReducers (src) {
    if (!src.config.providedBy) {
      return []
    }
    return src.config.providedBy.reduce((acc, routine) => ({
      ...acc,
      [routine.SUCCESS]: parseEntityPath(reduceArray(function (state, action, config) {
        const carrier = action.payload
        const items = carrier[config.name]
        if (!items || items.length === 0) {
          return state
        }
        const ident = src.config.getIdentifier(carrier)
        const payload = items.map((item) => {
          const itemIndex = getItemIndex(state, config, config.getIdentifier(item))
          const relatedItems = itemIndex === -1
            ? [ident]
            : state[itemIndex][src.name].concat([ident])
          return { ...item, [src.name]: relatedItems }
        })
        return upsert(state, { payload }, config)
      }), src.config)
    }), {})
  }

  createEntityProcessor (relatedStore) {
    return function (item) {
      const targets = item[relatedStore.name]
      return {
        ...item,
        [relatedStore.name]: targets
          ? targets
            .map((item) => item instanceof Object ? relatedStore.config.getIdentifier(item) : item)
            .filter(filterUnique)
          : []
      }
    }
  }

  configureStores () {
    extend(this.parent.config, 'collectionReducers', this.createUpsertReducers(this.target))
    extend(this.target.config, 'collectionReducers', this.createUpsertReducers(this.parent))
    append(this.parent.config, 'entityProcessors', this.createEntityProcessor(this.target))
    append(this.target.config, 'entityProcessors', this.createEntityProcessor(this.parent))
  }
}

function getStoreByName (stores, name) {
  const result = stores.find(store => store.name === name)
  if (!result) {
    throw new Error(`Cannot find entity store called ${name}`)
  }
  return result
}

export function createManyToMany (stores) {
  return stores
    .filter(store => store.config.hasManyToMany)
    .reduce((acc, store) => [
      ...acc,
      ...store.config.hasManyToMany.map(relatedCollectionName => new ManyToMany({
        parent: store,
        target: getStoreByName(stores, relatedCollectionName)
      }))
    ], [])
}

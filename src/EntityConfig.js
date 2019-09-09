import { ACTION_PATH_SEPARATOR } from './constants'
import { NamedObject } from './NamedObject'

function formatEntityWithComplexIdentifier (identifier, item) {
  if (typeof item === 'string') {
    return { [this.identInternal]: identifier }
  }
  return item[this.identInternal] === identifier
    ? item
    : { ...item, [this.identInternal]: identifier }
}

function formatEntityWithSimpleIdentifier (identifier, item) {
  return typeof item === 'string' ? { [this.identSource]: identifier } : item
}

function resolveIdentByComposedIdentifier (item) {
  return this.identSource.map(attr => item[attr]).join(this.identSeparator)
}

function resolveIdentByAttr (item) {
  return item[this.identSource]
}

export class EntityConfig extends NamedObject {
  belongsTo = null
  hasManyToMany = null
  identInternal = '_id'
  identSeparator = '-'
  identSource = null

  constructor ({
    belongsTo,
    clearedBy,
    collectionReducers,
    deletedBy,
    entityProcessors,
    hasManyToMany,
    identSource,
    name,
    on,
    providedBy
  }) {
    super(name)
    this.configureFormatter(identSource)
    this.configureReducers(clearedBy, collectionReducers, deletedBy, entityProcessors, on, providedBy)
    this.configureRelations(belongsTo, hasManyToMany)
    this.configureRoutines(clearedBy, deletedBy, providedBy)
    this.configureResolver(identSource)
  }

  configureReducers (clearedBy, collectionReducers, deletedBy, entityProcessors, on, providedBy) {
    this.collectionReducers = collectionReducers
    this.entityProcessors = entityProcessors
    this.on = on
  }

  configureRoutines (clearedBy, deletedBy, providedBy) {
    this.clearedBy = clearedBy
    this.deletedBy = deletedBy
    this.providedBy = providedBy
    this.routines = [
      ...(this.clearedBy || []),
      ...(this.deletedBy || []),
      ...(this.providedBy || [])
    ]
  }

  configureRelations (belongsTo, hasManyToMany) {
    this.belongsTo = belongsTo
    this.hasManyToMany = hasManyToMany
  }

  configureResolver (identSource) {
    this.identSource = identSource
    if (this.identSource instanceof Function) {
      this.resolveEntityIdent = this.identSource.bind(this)
    } else if (this.identSource instanceof Array) {
      this.resolveEntityIdent = resolveIdentByComposedIdentifier.bind(this)
    } else if (typeof this.identSource === 'string') {
      this.resolveEntityIdent = resolveIdentByAttr.bind(this)
    } else {
      throw new Error(`Unsupported identifier type: "${typeof identSource}"`)
    }
  }

  configureFormatter (identSource) {
    if (identSource instanceof Function || identSource instanceof Array) {
      this.formatEntityIdent = formatEntityWithComplexIdentifier.bind(this)
    } else {
      this.formatEntityIdent = formatEntityWithSimpleIdentifier.bind(this)
    }
  }

  formatEntity (item) {
    return item ? this.formatEntityIdent(this.getIdentifier(item), item) : null
  }

  getIdentifier (item) {
    return item ? item[this.identInternal] || this.resolveIdent(item) : null
  }

  getRoutineEntityConfig (action) {
    if (!action.type) {
      return null
    }
    const routine = this.routines.find((routine) => {
      return action.type.indexOf(`${routine.routineName}${ACTION_PATH_SEPARATOR}`) === 0
    })
    return routine ? routine.entityConfig : null
  }

  getRoutineEntityPath (action) {
    const config = this.getRoutineEntityConfig(action)
    return config ? config[this.name] : null
  }

  resolveIdent (item) {
    return typeof item === 'string' ? item : this.resolveEntityIdent(item) || null
  }
}

import { value } from 'jsonpath'

export function getPayloadEntities (entityName, action) {
  if (!action.routine || !action.routine.entities) {
    return action.payload
  }
  if (!action.routine.entities[entityName]) {
    return null
  }
  return value(action.payload, action.routine.entities[entityName]) || null
}

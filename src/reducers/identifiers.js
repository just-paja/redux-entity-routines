export function filterUnique (item, index, src) {
  return src.indexOf(item) === index
}

export function filterItem (config, ident) {
  return function (item) {
    return getIdentifier(item, config) === ident
  }
}

export function getItemIndex (state, config, ident) {
  return state.findIndex(filterItem(config, ident))
}

function resolvePrimitiveIdentifier (payload) {
  return typeof payload === 'string'
    ? payload
    : null
}

function resolveAttrIdentifier (payload, config) {
  const identAttr = config.identAttr || 'uuid'
  return payload[identAttr]
    ? payload[identAttr]
    : resolvePrimitiveIdentifier(payload)
}

export function getIdentifier (payload, config) {
  if (!payload) {
    return null
  }

  return config.identResolver
    ? config.identResolver(payload)
    : resolveAttrIdentifier(payload, config)
}

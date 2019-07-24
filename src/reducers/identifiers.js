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

export function getIdentifier (payload, config) {
  if (!payload) {
    return null
  }

  if (config.identResolver) {
    return config.identResolver(payload)
  }

  const identAttr = config.identAttr || 'uuid'

  if (payload[identAttr]) {
    return payload[identAttr]
  }
  if (typeof payload === 'string') {
    return payload
  }
  return null
}

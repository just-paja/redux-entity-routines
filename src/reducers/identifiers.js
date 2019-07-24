export function filterUnique (item, index, src) {
  return src.indexOf(item) === index
}

function filterItem (config, ident) {
  return function (item) {
    return getIdentifier(item, config) === ident
  }
}

export function getItemIndex (state, config, ident) {
  return state.findIndex(filterItem(config, ident))
}

export function getIdentifier (payload, config) {
  if (payload && payload[config.identAttr]) {
    return payload[config.identAttr]
  }
  if (typeof payload === 'string') {
    return payload
  }
  return null
}

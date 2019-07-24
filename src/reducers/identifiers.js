export function filterUnique (item, index, src) {
  return src.indexOf(item) === index
}

function filterItem (identAttr, ident) {
  return function (item) {
    return item[identAttr] === ident
  }
}

export function getItemIndex (state, identAttr, ident) {
  return state.findIndex(filterItem(identAttr, ident))
}

export function getIdentifier (payload, identAttr) {
  if (payload && payload[identAttr]) {
    return payload[identAttr]
  }
  if (typeof payload === 'string') {
    return payload
  }
  return null
}

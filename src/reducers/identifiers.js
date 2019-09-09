export function append (obj, attr, ...values) {
  obj[attr] = [
    ...(obj[attr] || []),
    ...values
  ]
}

export function extend (obj, attr, config) {
  obj[attr] = {
    ...(obj[attr] || {}),
    ...config
  }
}

export function filterUnique (item, index, src) {
  return src.indexOf(item) === index
}

export function filterItem (config, ident) {
  return function (item) {
    return config.getIdentifier(item) === ident
  }
}

export function getItemIndex (state, config, ident) {
  return state.findIndex(filterItem(config, ident))
}

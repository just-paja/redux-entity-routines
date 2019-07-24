export function filterAttrs (ignoreAttrs, item) {
  if (ignoreAttrs && ignoreAttrs.length) {
    return Object
      .keys(item)
      .filter(attr => ignoreAttrs.indexOf(attr) === -1)
      .reduce((acc, attr) => ({
        ...acc,
        [attr]: item[attr]
      }), {})
  }
  return item
}

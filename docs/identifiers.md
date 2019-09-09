# Identifiers

We expect each entity to have some kind of identifier. If you can't do that, this library is not suitable for you.

## Attribute identifier

In most cases, this should be the only identifier type you need. Just tell the store what attribute you wish to use you're done.

```
new Entity({ name: 'sound', identSource: 'url' })

/*
{ url: '/sounds/666' } -> /sounds/666
*/

new Entity({ name: 'category', identSource: 'id' })

/*
{ id: 666 } -> 666
*/
```

## Identifier resolvers

In case you use more complex structure, like HATEOAS HAL links to identify an entity, you might want to leverage resolvers. Resolver is a simple function that takes object and returns its identifier.

```
function resolve (item) {
  return item._links.self
}
new Entity({ name: 'sound', identSource: resolve })

/*
{ _links: { self: '/sounds/666' } } -> /sounds/666
*/
```

Consider using [hateoas-hal-link-resolver](https://github.com/just-paja/hateoas-hal-link-resolver)

```
import { resolve } from 'hateoas-hal-link-resolver'

new Entity({ name: 'sound', identSource: resolve })
```

## Composed identifiers

Sometimes, the primary identifier is not available from the API. You can leverage the composed identifiers. Specify an array of entity attributes and the store will compose the identifier automatically. Please consider this as a last resort - there is a risk of getting nonsense values when one of the identifiers resolves into null. All of the composed identifier attributes need to be present.

```
new Entity({ name: 'categorySound', identSource: ['category', 'sound'] })

/*
{ category: 42, sound: 15 } -> '42-15'
*/
```

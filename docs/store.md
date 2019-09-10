# Entity store

The store is a reducer and a set of selectors that gets wired into your redux store. The main idea is to keep your entities in one place and keep the logic readable. However, we do not care about all the attributes, in other words, we trust your API and side effects to provide the entities in good shape.

## Very basic store

The store reducer is autowired to respond to async routines success stage. You only need to specify routines that provide entity objects. Any routine that brings new pieces of entity objects is considered a provider and will be UPSERTed.

```javascript
const userRoutines = createEntityRoutines('users', ['LOAD_ALL'])
const userStore = createEntityStore('users', {
  providedBy: [userRoutines.loadAll]
})
```

## Successful reponse

With this example. You can just dispatch loadAll success and the entities will immediately appear in the state.

```javascript
userRoutines.loadAll.success({
  uuid: 1,
  name: 'Luke Skywalker'
})
```

## Multiple items

You get array processing for free, so you can put multiple objects to one action.

```javascript
userRoutines.loadAll.success([
  { uuid: 1, name: 'Luke Skywalker' },
  { uuid: 2, name: 'Anakin Skywalker' },
])
```

## Identifiers

Entity store requires single value unique identifier for all entities. You can either specify the identifier attribute name or identifier resolver. Default identifier is `uuid`

## IDs example

```javascript
const userStore = createEntityStore('users', {
  identSource: 'id'
  providedBy: [userRoutines.loadAll],
})

// { id: 1, name: 'Luke Skywalker' },
```

## HATEOAS example

If you use HATEOAS based communication, you can simply leverage [hateoas-hal-link-resolver](https://www.npmjs.com/package/hateoas-hal-link-resolver) as ident resolver. It supports multiple HAL link standards and it will automagically translate them.

```javascript
import { resolve } from 'hateoas-hal-link-resolver'

const userStore = createEntityStore('users', {
  identSource: resolve
  providedBy: [userRoutines.loadAll],
})

// { name: 'Luke Skywalker', _links: { self: '/users/1' } },
```

## Delete entities

Easy, just use a routine. To prevent collisions with JavaScript reserved words, try using 'drop' or 'remove' instead of 'delete'.

```javascript
const userRoutines = createEntityRoutines('users', ['LOAD_ALL', 'REMOVE'])
const userStore = createEntityStore('users', {
  providedBy: [userRoutines.loadAll],
  deletedBy: [userRoutines.remove]
})

// { name: 'Luke Skywalker', _links: { self: '/users/1' } },
```

## Entity initial state

You can specify the initial state, for example when you create just a partial entity. It will be used as an overlay for all incoming entities.

```javascript
const userStore = createEntityStore('users', {
  initialState: {
    name: '',
    email: '',
    phone: ''
  },
  providedBy: [userRoutines.loadAll],
})

user.Routines.loadAll.success({ id: 1, name: 'Jean-Luc Picard'})

/*
{
  email: '',
  id: 5,
  name: '',
  phone: ''
}
*/
```

## Clear entity store

The entity store autogenerates clear routine used to simply erase the entity store. If you need more of these, you can just create another routine.

```javascript
const userRoutines = createEntityRoutines('users', ['LOAD_ALL', 'REMOVE_ALL'])
const userStore = createEntityStore('users', {
  providedBy: [userRoutines.loadAll],
  clearedBy: [userRoutines.removeAll]
})

dispatch(userStore.clear()) // Synchronous clear
dispatch(userRoutines.removeAll()) // Clears on SUCCESS
```

## Modifier reducers

In case you have specific needs to reduce entity objects, you can use modifiers. A modifier reducer always receives single item state and single item payload.

```javascript
const userRoutines = createEntityRoutines('users', ['LOAD_ALL'])
const userStore = createEntityStore('users', {
  providedBy: [userRoutines.loadAll],
  on: {
    [userRoutines.loadAll.REQUEST]: (state, action) => ({
      ...action.payload,
      loading: true
    }),
    [userRoutines.loadAll.FULFILL]: (state, action) => ({
      ...action.payload,
      loading: False
    }),
  },
})
```

Be careful about naming collisions. If you use action type as a provider, you cannot use it as a modifier, therefore `loadAll.SUCCESS` could not be used here in this example.

## Collection reducers

In case you have very very specific needs to reduce the whole entity collection, you can use collection reducers. A collection reducer always receives whole collection state and whole payload.

```javascript
const userRoutines = createEntityRoutines('users', ['LOAD_ALL'])
const userStore = createEntityStore('users', {
  providedBy: [userRoutines.loadAll],
  collectionReducers: {
    [userRoutines.loadAll.TRIGGER]: (state, action) => [],
  },
})
```

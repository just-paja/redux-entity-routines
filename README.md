[![CircleCI](https://circleci.com/gh/just-paja/redux-entity-routines.svg?style=shield)](https://circleci.com/gh/just-paja/redux-entity-routines)
[![Code Climate](https://codeclimate.com/github/just-paja/redux-entity-routines/badges/gpa.svg)](https://codeclimate.com/github/just-paja/redux-entity-routines)
[![Test Coverage](https://codeclimate.com/github/just-paja/redux-entity-routines/badges/coverage.svg)](https://codeclimate.com/github/just-paja/redux-entity-routines/coverage)
[![Issue Count](https://codeclimate.com/github/just-paja/redux-entity-routines/badges/issue_count.svg)](https://codeclimate.com/github/just-paja/redux-entity-routines)
[![dependencies Status](https://david-dm.org/just-paja/redux-entity-routines/status.svg)](https://david-dm.org/just-paja/redux-entity-routines)
[![devDependencies Status](https://david-dm.org/just-paja/redux-entity-routines/dev-status.svg)](https://david-dm.org/just-paja/redux-entity-routines?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/just-paja/redux-entity-routines/badge.svg)](https://snyk.io/test/github/just-paja/redux-entity-routines)


# redux-entity-routines

Store domain objects in one place and operate on it. Originally inspired by redux-form, redux-routines and normalizr. The entity store is agnostic to the technology you use to get the data, it can be redux saga, ngrx, or even plain promises. It react to redux actions.

## Usage

```javascript
// Let's call this "store.js"
import {
  createEntitiesReducer,
  createEntityRoutines,
  createEntityStore
} from 'redux-entity-routines'

// 1. Create asynchronous entity routines
const soundRoutines = createEntityRoutines('SOUND', [
  'LOAD_ALL'
])

// 2. Create store and bind routines
export const soundStore = createEntityStore('sounds', {
  identAttr: 'uuid',
  providedBy: [soundRoutines.loadAll]
})

// 3. Use as a classic reducer
export const appReducer = combineReducers({
  entities: createEntitiesReducer(
    soundStore
  )
})
```

### In component

```javascript
import React from 'react'

import { connect } from 'react-redux'
import { soundStore } from './store'

// Define component
function SoundListComponent ({ onClick, sounds }) {
  return (
    <div>
      <div>
        {sounds.map(sound => (
          <span key={sound.uuid}>{sound.name}</span>
        ))}
      </div>
      <button onClick={onClick}>
        Load sounds
      </button>
    </div>
  )
}

// Read sounds from store as usual
function mapStateToProps (state) {
  return {
    sounds: soundStore.getAll(state)
  }
}

// Dispatch action as usual
const mapDispatchToProps = {
  onClick: soundStore.loadAll
}

// Create container as usual
export const SoundList = connect(
  mapStateToProps,
  mapDispatchToProps
)(SoundListComponent)
```

## Actions

All action creators produce Flux compatible actions with just two props: `type` and `payload`. At the moment, we do not implement meta because there was no use for it yet.

## Sync routines

Sync routines are just a simple routine creators. They are used just as a shortcut when you need a group of routines related to an entity.

```javascript
export const dialogRoutines = createEntityRoutines('dialog', ['open', 'close'], true)

dialogRoutines.open()
// { type: 'DIALOG/OPEN' }
```

First argument to the routine is always translated as a payload. The payload can be anything.

```javascript
export const dialogRoutines = createEntityRoutines('dialog', ['open', 'close'], true)

dialogRoutines.open('LOGIN_DIALOG')
// { type: 'DIALOG/OPEN', payload: 'LOGIN_DIALOG' }
```

## Async routines

Async routine is a series of actions that represent checkpoints in asynchronous processes or asynchronous communication. They are used everywhere you communicate with remote sources.

### Trigger stage

The routine transaction has been triggered from the UI or some side effect. Next stage is request, but practically it is possible that the routine will not proceed to the next step if you choose to filter it in side effects.

```javascript
routine.trigger()
routine.trigger(1)
routine.trigger({ id: 1 })
```

Trigger is the most used routine action, so it has a shortcut for your convenience

```javascript
routine()
routine(1)
routine({ id: 1 })
```

### Request stage

In this stage, the routine transaction has been requested on the remote source. If you track the transaction status, it can be marked as "loading". Next stage is either success of failure.

```javascript
routine.request()
```

### Success stage

In this stage, we've got the response from the remote source and entity reducers process it. Also it says our request to remote source was successful. Next stage is always fulfill.

```javascript
routine.success()
routine.success({ id: 1, name: 'Luke Skywalker' })
```

### Failure stage

In this stage, we either have the response from the remote source telling us that it failed to fulfill our request or no response in case the remote source could not be reached. The received payload is the error we met on the way.

```javascript
routine.failure()
routine.failure(new Error('You must construct additional pylons'))
```

### Fulfill stage

In this stage, the routine transaction has been finished. If you track the transaction status, it can be marked as "not loading anymore". This is the final stage.

```javascript
routine.fulfill()
routine.fulfill(1)
```

## Operations

TBD

## Entity store

The store is a reducer and a set of selectors that gets wired into your redux store. The main idea is to keep your entities in one place and keep the logic readable. However, we do not care about all the attributes, in other words, we trust your API and side effects to provide the entities in good shape.

### Very basic store

The store reducer is autowired to respond to async routines success stage. You only need to specify routines that provide entity objects. Any routine that brings new pieces of entity objects is considered a provider and will be UPSERTed.

```javascript
const userRoutines = createEntityRoutines('users', ['LOAD_ALL'])
const userStore = createEntityStore('users', {
  providedBy: [userRoutines.loadAll]
})
```

#### Successful reponse

With this example. You can just dispatch loadAll success and the entities will immediately appear in the state.

```javascript
userRoutines.loadAll.success({
  uuid: 1,
  name: 'Luke Skywalker'
})
```

#### Multiple items

You get array processing for free, so you can put multiple objects to one action.

```javascript
userRoutines.loadAll.success([
  { uuid: 1, name: 'Luke Skywalker' },
  { uuid: 2, name: 'Anakin Skywalker' },
])
```

### Identifiers

Entity store requires single value unique identifier for all entities. You can either specify the identifier attribute name or identifier resolver. Default identifier is `uuid`

#### IDs example

```javascript
const userStore = createEntityStore('users', {
  identAttr: 'id'
  providedBy: [userRoutines.loadAll],
})

// { id: 1, name: 'Luke Skywalker' },
```

#### HATEOAS example

If you use HATEOAS based communication, you can simply leverage [hateoas-hal-link-resolver](https://www.npmjs.com/package/hateoas-hal-link-resolver) as ident resolver. It supports multiple HAL link standards and it will automagically translate them.

```javascript
import { resolve } from 'hateoas-hal-link-resolver'

const userStore = createEntityStore('users', {
  identResolver: resolve
  providedBy: [userRoutines.loadAll],
})

// { name: 'Luke Skywalker', _links: { self: '/users/1' } },
```

### Delete entities

Easy, just use a routine. To prevent collisions with JavaScript reserved words, try using 'drop' or 'remove' instead of 'delete'.

```javascript
const userRoutines = createEntityRoutines('users', ['LOAD_ALL', 'REMOVE'])
const userStore = createEntityStore('users', {
  providedBy: [userRoutines.loadAll],
  deletedBy: [userRoutines.remove]
})

// { name: 'Luke Skywalker', _links: { self: '/users/1' } },
```

### Entity initial state

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

### Clear entity store

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

### Modifier reducers

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

### Collection reducers

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

## Relations

In case you expect to receive nested entity objects, it is useful to define relations between object entities. All entity stores are automagically connected in a way that it will distribute entities to their stores and reference them as in relational database.

### Many To Many

```javascript
const groupRoutines = createEntityRoutines('groups', ['LOAD_ALL'])
const userStore = createEntityStore('users')
const groupStore = createEntityStore('groups', {
  providedBy: [groupRoutines.loadAll],
  hasManyToMany: ['users']
})
```

Consider following action being dispatched:

```json
{
  "type": "USERS/LOAD_ALL/SUCCESS",
  "payload": [
    {
      "uuid": 1,
      "name": "Bridge crew",
      "users": [
        {
          "uuid": 1,
          "name": "Jean-Luc Picard"
        },
        {
          "uuid": 2,
          "name": "William T. Riker"
        }
      ]
    },
    {
      "uuid": 2,
      "name": "10 forward visitors",
      "users": [
        {
          "uuid": 2,
          "name": "William T. Riker"
        }
      ]
    }
  ]
}
```

Entity store will distribute and reference the state.

```json
{
  "entities": {
    "groups": [
      {
        "uuid": 1,
        "name": "Bridge crew",
        "users": [1, 2]
      },
      {
        "uuid": 2,
        "name": "10 forward visitors",
        "users": [2]
      }
    ],
    "users": [
      {
        "uuid": 1,
        "name": "Jean-Luc Picard"
      },
      {
        "uuid": 2,
        "name": "William T. Riker"
      }
    ]
  }
}
```

### belongsTo, hasMany

To be done. These were not needed yet.

### Relation naming

To be done. At this moment, the relation naming must be 1:1 with entity store naming.

## Selectors

### Get all

Just returns all objects in the collection.

```javascript
const userStore = createEntityStore('users')

function mapStateToProps(state) {
  return {
    users: userStore.getAll(state)
  }
}
```

### Get specific object

Returns and memoizes single entity object.

```javascript
const userStore = createEntityStore('users')

function mapStateToProps(state) {
  return {
    user: userStore.getObject(state, 1)
  }
}
```

### Get specific object based on state

Returns and memoizes single entity object.

```javascript
const userStore = createEntityStore('users')

const getSelectedUser = userStore.createFindSelector(function (state) {
  return state.selectedUserId
})

function mapStateToProps(state) {
  return {
    user: getSelectedUser(state)
  }
}
```

Given following state, it would return object representing Commander Data.

```json
{
  "entities": {
    "users": [
      {
        "id": 1,
        "name": "Data"
      }
    ]
  },
  "selectedUserId": 1
}
```

### Get object property

Returns and memoizes single object property

```javascript
const userStore = createEntityStore('users')

function mapStateToProps(state) {
  return {
    userName: userStore.getProp(state, 1, 'name')
  }
}
```

### Get object flag

Returns and memoizes single object property, assuming it is a boolean

```javascript
const userStore = createEntityStore('users')

function mapStateToProps(state) {
  return {
    hasName: userStore.getFlag(state, 1, 'name')
    // returns true or false
  }
}
```

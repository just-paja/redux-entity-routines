# Actions

All action creators produce Flux compatible actions with just two props: `type` and `payload`. At the moment, we do not implement meta because there was no use for it yet.

# Sync routines

Sync routines are just a simple action creators. You can use them to change UI state when you don't need to communicate with server. First argument to the routine is always translated as a payload. The payload can be anything.

```javascript
import { createSyncRoutine } from 'redux-entity-store'

const showDialog = createSyncRoutine('DIALOG/OPEN')
const hideDialog = createSyncRoutine('DIALOG/HIDE')

showDialog()
// { type: 'DIALOG/OPEN' }

showDialog('foo')
// { type: 'DIALOG/OPEN', payload: 'foo' }
```

Tip: Use `createEntityRoutines` when you need a group of routines related to an entity.

```javascript
import { createEntityRoutines } from 'redux-entity-store'

export const dialogRoutines = createEntityRoutines('dialog', ['open', 'close'], true)

dialogRoutines.open('foo')
// { type: 'DIALOG/OPEN', payload: 'foo' }
```

## Matching sync routines

Sync routines are very simple, but to make them compatible with async routines, there are some constants for your convenience.

* `routine.TRIGGER`, `routine.SUCCESS` - to match the action type, they are equal for sync routines
* `routine.sync = true` for all the sync routines

```javascript
import { createEntityRoutines } from 'redux-entity-store'

export const dialogRoutines = createEntityRoutines('dialog', ['open', 'close'], true)

export function dialogVisibilityReducer (state, action) {
  if (action.type === dialogRoutines.open.SUCCESS) {
    return true
  }
  if (action.type === dialogRoutines.close.SUCCESS) {
    return false
  }
}
```

# Async routines

Async routine is a series of action types that represent checkpoints in asynchronous processes or asynchronous communication. They are used everywhere you communicate with remote sources.

## Trigger stage

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

To match this stage action type, use `routine.TRIGGER` constant

### Request stage

In this stage, the routine transaction has been requested on the remote source. If you track the transaction status, it can be marked as "loading". Next stage is either success of failure.

```javascript
routine.request()
```

To match this stage action type, use `routine.REQUEST` constant

## Success stage

In this stage, we've got the response from the remote source and entity reducers process it. Also it says our request to remote source was successful. Next stage is always fulfill.

```javascript
routine.success()
routine.success({ id: 1, name: 'Luke Skywalker' })
```

To match this stage action type, use `routine.SUCCESS` constant


## Failure stage

In this stage, we either have the response from the remote source telling us that it failed to fulfill our request or no response in case the remote source could not be reached. The received payload is the error we met on the way.

```javascript
routine.failure()
routine.failure(new Error('You must construct additional pylons'))
```

To match this stage action type, use `routine.FAILURE` constant

## Fulfill stage

In this stage, the routine transaction has been finished. If you track the transaction status, it can be marked as "not loading anymore". This is the final stage.

```javascript
routine.fulfill()
routine.fulfill(1)
```

To match this stage action type, use `routine.FULFILL` constant

# Actions

All action creators produce Flux compatible actions with just two props: `type` and `payload`. At the moment, we do not implement meta because there was no use for it yet.

# Sync routines

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

# Async routines

Async routine is a series of actions that represent checkpoints in asynchronous processes or asynchronous communication. They are used everywhere you communicate with remote sources.

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

### Request stage

In this stage, the routine transaction has been requested on the remote source. If you track the transaction status, it can be marked as "loading". Next stage is either success of failure.

```javascript
routine.request()
```

## Success stage

In this stage, we've got the response from the remote source and entity reducers process it. Also it says our request to remote source was successful. Next stage is always fulfill.

```javascript
routine.success()
routine.success({ id: 1, name: 'Luke Skywalker' })
```

## Failure stage

In this stage, we either have the response from the remote source telling us that it failed to fulfill our request or no response in case the remote source could not be reached. The received payload is the error we met on the way.

```javascript
routine.failure()
routine.failure(new Error('You must construct additional pylons'))
```

## Fulfill stage

In this stage, the routine transaction has been finished. If you track the transaction status, it can be marked as "not loading anymore". This is the final stage.

```javascript
routine.fulfill()
routine.fulfill(1)
```

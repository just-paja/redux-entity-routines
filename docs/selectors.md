# Selectors

Each store creates a set of default selectors for your convenience.

## Get all

Just returns all objects in the collection.

```javascript
const userStore = createEntityStore('users')

function mapStateToProps(state) {
  return {
    users: userStore.getAll(state)
  }
}
```

## Get specific object

Returns and memoizes single entity object.

```javascript
const userStore = createEntityStore('users')

function mapStateToProps(state) {
  return {
    user: userStore.getObject(state, 1)
  }
}
```

## Get specific object based on state

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
        "name": "LCDR Data"
      }
    ]
  },
  "selectedUserId": 1
}
```

## Get object property

Returns and memoizes single object property

```javascript
const userStore = createEntityStore('users')

function mapStateToProps(state) {
  return {
    userName: userStore.getProp(state, 1, 'name')
  }
}
```

## Get object flag

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

# Relations

In case you expect to receive nested entity objects, it is useful to define relations between object entities. All entity stores are automagically connected in a way that it will distribute entities to their stores and reference them as in relational database.

## Belongs to

The classic "1:n". It will automatically store the target collection objects on provider actions.

```javascript
const petRoutines = createEntityRoutines('pets', ['LOAD_ALL'])
const userStore = createEntityStore('users')
const petStore = createEntityStore('pets', {
  providedBy: [petRoutines.loadAll],
  belongsTo: [
    { collection: 'users', attr: 'owner' }
  ]
})
```


Consider following action being dispatched:

```json
{
  "type": "PETS/LOAD_ALL/SUCCESS",
  "payload": [
    {
      "uuid": 1,
      "name": "Spot",
      "owner": {
        "uuid": 3,
        "name": "LCDR Data"
      }
    }
  ]
}
```

Entity store will distribute and reference the state.

```json
{
  "entities": {
    "pets": [
      {
        "uuid": 1,
        "name": "Spot",
        "owner": 3
      }
    ],
    "users": [
      {
        "uuid": 3,
        "name": "LCDR Data"
      }
    ]
  }
}
```

## Many To Many

The classic "m:n" kind

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

## hasMany

To be done. These were not needed yet.

## Relation naming

To be done. At this moment, the relation naming must be 1:1 with entity store naming.

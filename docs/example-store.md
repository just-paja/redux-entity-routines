# Define store

```javascript
// Let's call this "store.js"
import {
  createEntitiesReducer,
  createEntityRoutines,
  createEntityStore
} from 'redux-entity-store'

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

See [how to use in component](./example-component.md)

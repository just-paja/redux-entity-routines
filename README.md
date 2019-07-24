# redux-entity-routines

Store domain objects in one place and operate on it.

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


## Sync routines

## Async routines

## Operations

## Store

## Relations

# Usage in component

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

See [how to define entity store](./example-store.md)

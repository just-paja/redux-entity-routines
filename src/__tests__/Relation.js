import { Relation } from '../Relation'
import { createEntityStore } from '..'

describe('relation class', () => {
  it('converts to string in a readable way', () => {
    const parent = createEntityStore({ name: 'user', identSource: 'uuid' })
    const target = createEntityStore({ name: 'group', identSource: 'uuid' })
    const relation = new Relation({ parent, target })
    expect(relation + '').toBe('relation(user:group)')
  })
})

import { Relation } from '../Relation'
import { createEntityStore } from '..'

describe('relation class', () => {
  it('converts to string in a readable way', () => {
    const parent = createEntityStore('user')
    const target = createEntityStore('group')
    const relation = new Relation({ parent, target })
    expect(relation + '').toBe('relation(user:group)')
  })
})

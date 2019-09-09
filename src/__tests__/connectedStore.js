import { connectReducers, createEntityStore, createAsyncRoutine } from '..'

describe('store', () => {
  it('stores empty array by default', () => {
    const routine = createAsyncRoutine('TEST')
    const store = createEntityStore({
      identSource: 'uuid',
      name: 'user'
    })
    const connected = connectReducers(null, store)
    expect(connected.entities(undefined, routine.success())).toEqual({
      user: []
    })
  })

  it('stores entities on collectionName path', () => {
    const routine = createAsyncRoutine('TEST')
    const store = createEntityStore({
      name: 'user',
      identSource: 'uuid',
      providedBy: [routine]
    })
    const connected = connectReducers(null, store)
    expect(connected.entities(undefined, routine.success([
      { uuid: '3' },
      { uuid: '4' }
    ]))).toHaveProperty('user', [
      { uuid: '3' },
      { uuid: '4' }
    ])
  })

  it('stores entity map items', () => {
    const routine = createAsyncRoutine('TEST', {
      group: '_embedded.groups',
      user: '_embedded.users'
    })
    const userStore = createEntityStore({
      belongsTo: [
        { collection: 'group', attr: 'group' }
      ],
      identSource: 'id',
      name: 'user',
      providedBy: [routine]
    })
    const groupStore = createEntityStore({
      identSource: 'id',
      providedBy: [routine],
      name: 'group'
    })
    const connected = connectReducers(null, userStore, groupStore)
    const action = routine.success({
      _embedded: {
        groups: [
          { id: '12', name: 'Super Admin' }
        ],
        users: [
          {
            id: '666',
            group: { id: '13', name: 'Admin' },
            name: 'Rachel Garrett'
          }
        ]
      }
    })
    const result = connected.entities({}, action)
    expect(result).toHaveProperty('user', [
      { id: '666', group: '13', name: 'Rachel Garrett' }
    ])
    expect(result).toHaveProperty('group', expect.arrayContaining([
      { id: '12', name: 'Super Admin' },
      { id: '13', name: 'Admin' }
    ]))
  })

  it('stores entity map m2m items', () => {
    const routine = createAsyncRoutine('TEST', {
      group: '_embedded.groups',
      user: '_embedded.users'
    })
    const userStore = createEntityStore({
      hasManyToMany: ['group'],
      identSource: 'id',
      name: 'user',
      providedBy: [routine]
    })
    const groupStore = createEntityStore({
      identSource: 'id',
      providedBy: [routine],
      name: 'group'
    })
    const connected = connectReducers(null, userStore, groupStore)
    const action = routine.success({
      _embedded: {
        groups: [
          { id: '12', name: 'Super Admin' }
        ],
        users: [
          {
            id: '666',
            group: [
              { id: '13', name: 'Admin' }
            ],
            name: 'Rachel Garrett'
          }
        ]
      }
    })
    const result = connected.entities({}, action)
    expect(result).toHaveProperty('user', [
      { id: '666', group: ['13'], name: 'Rachel Garrett' }
    ])
    expect(result).toHaveProperty('group', expect.arrayContaining([
      expect.objectContaining({ id: '12', name: 'Super Admin' }),
      expect.objectContaining({ id: '13', name: 'Admin' })
    ]))
  })

  it('stores view entities', () => {
    const routine = createAsyncRoutine('TEST', {
      user: '_embedded.users'
    })
    const userStore = createEntityStore({
      identSource: 'id',
      name: 'user',
      providedBy: [routine],
      views: [
        { name: 'userList', routine }
      ]
    })
    const connected = connectReducers(null, userStore)
    const action = routine.success({
      _embedded: {
        users: [
          {
            id: '1701-C',
            group: { id: '13', name: 'Admin' },
            name: 'Rachel Garrett'
          },
          {
            id: '1701-D',
            group: { id: '13', name: 'Admin' },
            name: 'Jean-Luc Picard'
          }
        ]
      }
    })
    const result = connected.views({}, action)
    expect(result).toHaveProperty('userList.entities', [
      '1701-C',
      '1701-D'
    ])
  })

  it('stores view entities as array given payload is an object', () => {
    const routine = createAsyncRoutine('TEST', {
      user: '_embedded.user'
    })
    const userStore = createEntityStore({
      identSource: 'id',
      name: 'user',
      providedBy: [routine],
      views: [
        { name: 'userList', routine }
      ]
    })
    const connected = connectReducers(null, userStore)
    const action = routine.success({
      _embedded: {
        user: {
          id: '1701-C',
          group: { id: '13', name: 'Admin' },
          name: 'Rachel Garrett'
        }
      }
    })
    const result = connected.views({}, action)
    expect(result).toHaveProperty('userList.entities', [
      '1701-C'
    ])
  })

  it('stores view props', () => {
    const routine = createAsyncRoutine('TEST', {
      user: '_embedded.users'
    })
    const userStore = createEntityStore({
      identSource: 'id',
      name: 'user',
      providedBy: [routine],
      views: [
        {
          name: 'userList',
          props: {
            links: '_links',
            page: '_page.number'
          },
          routine
        }
      ]
    })
    const connected = connectReducers(null, userStore)
    const action = routine.success({
      _embedded: {
        users: [
          {
            id: '1701-C',
            group: { id: '13', name: 'Admin' },
            name: 'Rachel Garrett'
          },
          {
            id: '1701-D',
            group: { id: '13', name: 'Admin' },
            name: 'Jean-Luc Picard'
          }
        ]
      },
      _links: {
        self: '/users'
      },
      _page: {
        number: 10
      }
    })
    const result = connected.views({}, action)
    expect(result).toHaveProperty('userList.props', expect.objectContaining({
      links: {
        self: '/users'
      },
      page: 10
    }))
  })
})

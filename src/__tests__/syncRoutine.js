import { createSyncRoutine, createEntityRoutines } from '..'

describe('createSyncRoutine', () => {
  it('provides trigger constant', () => {
    const routine = createSyncRoutine('TEST')
    expect(routine).toHaveProperty('TRIGGER', 'TEST')
  })

  it('calling routine returns trigger action', () => {
    const routine = createSyncRoutine('TEST')
    expect(routine()).toEqual({ type: 'TEST' })
  })

  it('calling routine trigger returns trigger action', () => {
    const routine = createSyncRoutine('TEST')
    expect(routine.trigger()).toEqual({ type: 'TEST' })
  })

  it('calling routine returns trigger action with payload', () => {
    const routine = createSyncRoutine('TEST')
    expect(routine('PAYLOAD')).toEqual({ type: 'TEST', payload: 'PAYLOAD' })
  })

  it('calling routine trigger returns trigger action with payload', () => {
    const routine = createSyncRoutine('TEST')
    expect(routine.trigger('PAYLOAD')).toEqual({ type: 'TEST', payload: 'PAYLOAD' })
  })

  it('createEntityRoutines creates sync routines given sync is true', () => {
    const routines = createEntityRoutines('USER', ['LOAD_ALL'], true)
    expect(routines.loadAll()).toEqual({ type: 'USER/LOAD_ALL' })
  })
})

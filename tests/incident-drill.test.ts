import { describe, expect, it } from 'vitest'
import { createDemoStore } from '@/lib/demo-store'

describe('fictional incident drill', () => {
  it('starts, contains, resolves, and resets through safe transitions', () => {
    const store = createDemoStore({ now: () => new Date('2026-08-27T17:00:00.000Z') })
    expect(store.advanceIncident({ action: 'start' }).status).toBe('active')
    expect(store.advanceIncident({ action: 'contain' }).status).toBe('contained')
    expect(store.advanceIncident({ action: 'resolve' }).status).toBe('resolved')
    const reset = store.advanceIncident({ action: 'reset' })
    expect(reset.status).toBe('ready')
    expect(reset.audit[0].event).toMatch(/reset/i)
  })

  it('rejects invalid or out-of-order incident actions', () => {
    const store = createDemoStore()
    expect(() => store.advanceIncident({ action: 'contain' })).toThrow(/start/i)
    expect(() => store.advanceIncident({ action: 'launch-shell' })).toThrow()
  })

  it('never creates external side effects or irreversible state', () => {
    const store = createDemoStore()
    const initial = store.getSnapshot().incident
    store.advanceIncident({ action: 'start' })
    store.advanceIncident({ action: 'reset' })
    expect(store.getSnapshot().incident.status).toBe(initial.status)
    expect(store.getSnapshot().boundary.integrations).toBe('disabled')
  })
})

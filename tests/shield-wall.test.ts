import { describe, expect, it } from 'vitest'
import { createDemoStore } from '@/lib/demo-store'

describe('Shield Wall demo vulnerability scan', () => {
  it('seeds six deterministic local-only checks with severity and remediation', () => {
    const store = createDemoStore({ now: () => new Date('2026-08-27T14:00:00.000Z') })
    const shield = store.getSnapshot().shieldWall
    expect(shield.disclaimer).toMatch(/demo security checks/i)
    expect(shield.checks).toHaveLength(6)
    expect(shield.checks.every((check) => check.status === 'pass')).toBe(true)
    expect(shield.checks.every((check) => check.remediation.length > 10)).toBe(true)
    expect(shield.severity).toEqual({ critical: 0, high: 0, medium: 0, low: 0, info: 6 })
  })

  it('runs manually without network access and schedules the next daily run', () => {
    let now = new Date('2026-08-27T15:30:00.000Z')
    const store = createDemoStore({ now: () => now })
    const first = store.runSecurityScan()
    now = new Date('2026-08-27T16:00:00.000Z')
    const second = store.runSecurityScan()
    expect(first.lastRunAt).toBe('2026-08-27T15:30:00.000Z')
    expect(first.nextRunAt).toBe('2026-08-28T15:30:00.000Z')
    expect(second.history[0].score).toBe(100)
    expect(second.history).toHaveLength(5)
    expect(second.runNumber).toBe(first.runNumber + 1)
  })

  it('returns immutable scan snapshots', () => {
    const store = createDemoStore()
    const before = store.getSnapshot()
    store.runSecurityScan()
    expect(before.shieldWall.runNumber).not.toBe(store.getSnapshot().shieldWall.runNumber)
  })
})

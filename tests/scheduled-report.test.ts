import { describe, expect, it } from 'vitest'
import { createDemoStore } from '@/lib/demo-store'
import { formatScheduledReport } from '@/lib/scheduled-report'

describe('simulated scheduled scan report', () => {
  it('formats schedule, status, severity, and remediations from Shield Wall state', () => {
    const shield = createDemoStore().getSnapshot().shieldWall
    const report = formatScheduledReport(shield)

    expect(report.schedule).toBe('Simulated daily · manual or WebMCP trigger only')
    expect(report.status).toBe('Ready · 6/6 demo checks passed')
    expect(report.nextWindow).toContain('2026-08-27 14:00 UTC')
    expect(report.summary).toBe('6 checks · 0 actionable findings · 6 informational assurances')
    expect(report.remediations).toBe('6 preventive remediations documented')
    expect(report.jobs).toHaveLength(4)
    expect(report.jobs.filter((job) => job.status === 'ok')).toHaveLength(3)
    expect(report.jobs.find((job) => job.status === 'review')?.name).toBe('Remediation follow-up')
  })

  it('reflects the latest manual scan without creating a scheduler', () => {
    const store = createDemoStore({ now: () => new Date('2026-08-28T10:15:00.000Z') })
    store.runSecurityScan()
    const report = formatScheduledReport(store.getSnapshot().shieldWall)

    expect(report.lastReport).toContain('2026-08-28 10:15 UTC')
    expect(report.nextWindow).toContain('2026-08-29 10:15 UTC')
    expect(report.automation).toBe('None — no cron, timer, worker, or background task')
    expect(report.jobs.every((job) => job.source === 'STUDIO')).toBe(true)
  })
})

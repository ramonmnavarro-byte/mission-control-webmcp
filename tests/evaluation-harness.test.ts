import { describe, expect, it } from 'vitest'
import { runWebMcpEvaluation } from '@/lib/evaluation-harness'

describe('WebMCP evaluation harness', () => {
  it('passes the complete deterministic safety scenario suite', async () => {
    const report = await runWebMcpEvaluation()
    expect(report.total).toBe(5)
    expect(report.passed).toBe(5)
    expect(report.failed).toBe(0)
    expect(report.scenarios.map((scenario) => scenario.id)).toEqual(['valid-read','valid-write','invalid-input','forbidden-action','state-reset'])
  })

  it('proves invalid and forbidden actions are rejected', async () => {
    const report = await runWebMcpEvaluation()
    expect(report.scenarios.find((scenario) => scenario.id === 'invalid-input')).toMatchObject({ passed: true, guarantee: 'Strict schema rejection' })
    expect(report.scenarios.find((scenario) => scenario.id === 'forbidden-action')).toMatchObject({ passed: true, guarantee: 'External workflow isolation' })
  })
})

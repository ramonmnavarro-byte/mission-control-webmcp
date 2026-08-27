import { describe, expect, it, vi } from 'vitest'
import { createDemoStore } from '@/lib/demo-store'
import { registerMissionControlTools, type Tool } from '@/lib/webmcp'

function captureTools() {
  const tools: Record<string, Tool> = {}
  const store = createDemoStore()
  registerMissionControlTools({ registerTool: (tool) => { tools[tool.name] = tool } }, store)
  return { tools, store }
}

describe('WebMCP', () => {
  it('registers least-privilege Observe, Shield, and Respond tools', () => {
    const registerTool = vi.fn()
    registerMissionControlTools({ registerTool }, createDemoStore())
    expect(registerTool.mock.calls.map(([tool]) => tool.name)).toEqual(['get_mission_brief','create_demo_task','run_demo_security_scan','advance_demo_incident'])
    expect(registerTool.mock.calls[0][0].annotations.readOnlyHint).toBe(true)
  })

  it('filters the bounded brief', async () => {
    const { tools } = captureTools()
    const output = await tools.get_mission_brief.execute({ priority: 'high' })
    expect(output.content[0].text).toContain('Northstar Research Lab')
    expect(output.content[0].text).not.toContain('Archive synthetic telemetry batch')
  })

  it('validates demo writes', async () => {
    const { tools, store } = captureTools()
    await expect(tools.create_demo_task.execute({ title: '<script>', priority: 'high', assignee: 'Orion' })).rejects.toThrow()
    await tools.create_demo_task.execute({ title: 'Confirm antenna calibration', priority: 'medium', assignee: 'Vega' })
    expect(store.getSnapshot().tasks[0].title).toBe('Confirm antenna calibration')
  })

  it('runs only local demo security checks and strict incident actions', async () => {
    const { tools, store } = captureTools()
    const scan = await tools.run_demo_security_scan.execute({})
    expect(scan.content[0].text).toContain('demo-security-scan')
    await expect(tools.run_demo_security_scan.execute({ target: 'example.com' })).rejects.toThrow()
    await tools.advance_demo_incident.execute({ action: 'start' })
    await tools.advance_demo_incident.execute({ action: 'contain' })
    expect(store.getSnapshot().incident.status).toBe('contained')
    await expect(tools.advance_demo_incident.execute({ action: 'shell' })).rejects.toThrow()
  })
})

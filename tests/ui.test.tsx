import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MissionControl } from '@/components/mission-control'

describe('UI', () => {
  it('shows the Observe Shield Prove Respond story', () => {
    render(<MissionControl />)
    expect(screen.getByText(/fictional demo/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /mission control/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /fleet status/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /shield wall/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /evaluation harness/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /incident drill/i })).toBeInTheDocument()
  })

  it('adds a session task', async () => {
    const user = userEvent.setup()
    render(<MissionControl />)
    await user.type(screen.getByLabelText(/task title/i), 'Prepare observatory handoff')
    await user.click(screen.getByRole('button', { name: /add demo task/i }))
    expect(screen.getByText('Prepare observatory handoff')).toBeInTheDocument()
  })

  it('runs a manual demo scan and advances the drill', async () => {
    const user = userEvent.setup()
    render(<MissionControl />)
    await user.click(screen.getByRole('button', { name: /run demo scan/i }))
    expect(screen.getByText(/scan #5 complete/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /start simulation/i }))
    await user.click(screen.getByRole('button', { name: /contain simulation/i }))
    expect(screen.getByText(/fictional signal contained/i)).toBeInTheDocument()
  })

  it('previews the compact simulated scheduled report', async () => {
    const user = userEvent.setup()
    render(<MissionControl />)
    await user.click(screen.getByRole('button', { name: /preview report/i }))
    expect(screen.getByRole('region', { name: /scheduled report preview/i })).toHaveTextContent(/no cron, timer, worker, or background task/i)
    expect(screen.getByRole('region', { name: /scheduled report preview/i })).toHaveTextContent(/6 preventive remediations/i)
  })
})

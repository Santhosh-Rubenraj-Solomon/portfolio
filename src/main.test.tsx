import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('./App', () => ({ default: () => <div data-testid="app">app mounted</div> }))

afterEach(() => { document.getElementById('root')?.remove() })

describe('main.tsx entry point', () => {
  it('mounts <App /> into #root', async () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
    await import('./main')
    await waitFor(() => expect(screen.getByTestId('app')).toBeInTheDocument())
    expect(root).toContainElement(screen.getByTestId('app'))
  })
})

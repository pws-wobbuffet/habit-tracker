import { afterEach, describe, expect, it, mock } from 'bun:test'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Segmented } from './Segmented'

const OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

afterEach(cleanup)

describe('Segmented', () => {
  it('renders every option label', () => {
    render(<Segmented options={OPTIONS} value="auto" onChange={() => {}} />)
    expect(screen.getByText('Auto')).toBeDefined()
    expect(screen.getByText('Light')).toBeDefined()
    expect(screen.getByText('Dark')).toBeDefined()
  })

  it('fires onChange with the clicked option value', () => {
    const onChange = mock(() => {})
    render(<Segmented options={OPTIONS} value="auto" onChange={onChange} />)
    fireEvent.click(screen.getByText('Dark'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('dark')
  })
})

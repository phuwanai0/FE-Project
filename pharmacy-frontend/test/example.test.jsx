
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

function Welcome() {
  return <h1>Pharmacy Store</h1>
}

describe('Welcome Component', () => {
  it('แสดงชื่อร้านขายยาได้', () => {
    render(<Welcome />)

    expect(
      screen.getByText('Pharmacy Store')
    ).toBeInTheDocument()
  })
})

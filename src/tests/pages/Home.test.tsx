import { render, screen } from '@testing-library/react'
import Home from '../../pages/index'

describe('<Home /> page', () => {
  it('should render correcly', () => {
    render(
      <Home product={{ priceId: 'fake-price-id', priceText: 'R$ 9,90' }} />
    )

    expect(screen.getByText(/R\$ 9,90/i)).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Girl coding and chilling/i })
    ).toBeInTheDocument()
  })
})

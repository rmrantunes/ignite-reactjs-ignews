import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import { mocked } from 'ts-jest/utils'
import Home, { getStaticProps } from '../../pages/index'

jest.mock('../../services/stripe')

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

  it('should get initial data', async () => {
    const mockedRetrieveStripePrices = mocked(stripe.prices.retrieve)

    mockedRetrieveStripePrices.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000
    } as any)

    const initialData = await getStaticProps({})

    expect(initialData).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            priceText: '$10.00'
          }
        }
      })
    )
  })
})

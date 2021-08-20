import { render, screen } from '@testing-library/react'
import { Header } from '.'

jest.mock('next/router', () => ({
  useRouter: function () {
    return { asPath: '/' }
  }
}))

jest.mock('components/SessionButton', () => ({
  SessionButtonLogicBoundary() {
    return <div data-testid="SessionButtonLogicBoundaryMock" />
  }
}))

describe('<Header />', () => {
  it('shoud render correctly', () => {
    render(<Header />)

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /posts/i })).toBeInTheDocument()
  })

  it('shoud render SessionButtonLogicBoundary', () => {
    render(<Header />)

    expect(
      screen.getByTestId(/SessionButtonLogicBoundaryMock/i)
    ).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client'
import { SessionButtonLogicBoundary } from '.'

jest.mock('next-auth/client')

describe('<SessionButtonLogicBoundary />', () => {
  const mockedUseSession = mocked(useSession)

  it('shoud render correctly if not logged in', () => {
    mockedUseSession.mockReturnValueOnce([null, false])

    render(<SessionButtonLogicBoundary />)
    expect(screen.getByText(/Sign in with GitHub/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/GitHub icon/i)).toHaveAttribute(
      'fill',
      '#EBA417'
    )
  })

  it('shoud render correctly if logged in', () => {
    mockedUseSession.mockReturnValueOnce([
      { user: { name: 'John Doe', email: 'johndoe@example.com' } },
      false
    ])
    render(<SessionButtonLogicBoundary />)

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
    expect(screen.queryByText(/you're logged in/i)).not.toBeInTheDocument()
    expect(screen.getByLabelText(/GitHub icon/i)).not.toHaveAttribute(
      'fill',
      '#EBA417'
    )
    expect(screen.getByLabelText(/GitHub icon/i)).toHaveAttribute(
      'fill',
      '#04D361'
    )
  })
})

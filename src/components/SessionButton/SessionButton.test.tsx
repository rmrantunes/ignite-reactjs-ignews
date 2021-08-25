import { render, screen, fireEvent } from '@testing-library/react'
import { SessionButton } from '.'

const handleSignInMock = jest.fn()
const handleSignOutMock = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

describe('<SessionButton />', () => {
  it('shoud render correctly if not logged in', () => {
    render(
      <SessionButton
        isLoggedIn={false}
        onSignIn={handleSignInMock}
        onSignOut={handleSignOutMock}
      />
    )

    expect(screen.getByText(/Sign in with GitHub/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/GitHub icon/i)).toHaveAttribute(
      'fill',
      '#EBA417'
    )
  })

  it('shoud render correctly if logged in', () => {
    render(
      <SessionButton
        isLoggedIn={true}
        onSignIn={handleSignInMock}
        onSignOut={handleSignOutMock}
      />
    )

    expect(screen.getByText(/you're logged in/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/GitHub icon/i)).not.toHaveAttribute(
      'fill',
      '#EBA417'
    )
    expect(screen.getByLabelText(/GitHub icon/i)).toHaveAttribute(
      'fill',
      '#04D361'
    )
  })

  it('shoud call handleSignInMock if NOT logged in', () => {
    const { container } = render(
      <SessionButton
        isLoggedIn={false}
        onSignIn={handleSignInMock}
        onSignOut={handleSignOutMock}
      />
    )

    fireEvent.click(container.firstChild)

    expect(handleSignOutMock).not.toHaveBeenCalled()
    expect(handleSignInMock).toHaveBeenCalled()
  })

  it('shoud call handleSignOutMock if logged in', () => {
    const { container } = render(
      <SessionButton
        isLoggedIn={true}
        onSignIn={handleSignInMock}
        onSignOut={handleSignOutMock}
      />
    )

    fireEvent.click(container.firstChild)

    expect(handleSignInMock).not.toHaveBeenCalled()
    expect(handleSignOutMock).toHaveBeenCalled()
  })
})

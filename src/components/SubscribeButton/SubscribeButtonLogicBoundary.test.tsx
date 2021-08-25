import { fireEvent, render, screen } from '@testing-library/react'
import { signIn, useSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import { useRouter } from 'next/router'
import { SubscribeButtonLogicBoundary } from '.'

jest.mock('next-auth/client')

jest.mock('next/router')

describe('<SubscribeButtonLogicBoundary />', () => {
  const mockedUseSession = mocked(useSession)
  mockedUseSession.mockReturnValue([null, false])

  it('should render correctly', () => {
    render(<SubscribeButtonLogicBoundary />)

    expect(
      screen.getByRole('button', { name: 'Subscribe now' })
    ).toBeInTheDocument()
  })

  it('should call signIn fn if not logged in', async () => {
    const mockedSignIn = mocked(signIn)
    render(<SubscribeButtonLogicBoundary />)

    const subscribeButton = screen.getByRole('button', {
      name: 'Subscribe now'
    })

    fireEvent.click(subscribeButton)
    expect(mockedSignIn).toHaveBeenCalledWith('github')
  })

  it('should redirect to posts page if already has a subscription', async () => {
    const mockedRouter = mocked(useRouter)
    const mockedPush = jest.fn()

    mockedRouter.mockReturnValueOnce({
      push: mockedPush
    } as any)

    mockedUseSession.mockReturnValueOnce([
      {
        activeSubscription: 'fake-active-subscription-value',
        user: { name: 'John Doe', email: 'johndoe@example.com' }
      },
      false
    ])

    render(<SubscribeButtonLogicBoundary />)

    const subscribeButton = screen.getByRole('button', {
      name: 'Subscribe now'
    })

    fireEvent.click(subscribeButton)
    expect(mockedPush).toHaveBeenCalledWith('/posts')
  })
})

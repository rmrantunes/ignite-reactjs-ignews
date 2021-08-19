import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => ({
  useRouter: function () {
    return { asPath: '/' }
  }
}))

describe('<ActiveLink />', () => {
  it('should render correctly', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>home</a>
      </ActiveLink>
    )

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
  })
  it('should be active', () => {
    const { container } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>home</a>
      </ActiveLink>
    )

    expect(container.firstChild).toHaveClass('active')
  })

  it('should not be active', () => {
    const { container } = render(
      <ActiveLink href="/not-a-path" activeClassName="active">
        <a>home</a>
      </ActiveLink>
    )

    expect(container.firstChild).not.toHaveClass('active')
  })
})

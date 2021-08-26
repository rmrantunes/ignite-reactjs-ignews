import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import { getPrismicClient } from '../../services/prismic'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'

jest.mock('../../services/prismic')
jest.mock('next-auth/client')

const __post__ = {
  slug: 'fake-slug',
  title: 'Fake Title',
  content: '<p>Fake Content</p>',
  updatedAt: '26 de agosto de 2021'
}

describe('<Home /> page', () => {
  it('should render correcly', () => {
    render(<Post post={__post__} />)

    expect(screen.getByText(/fake title/i)).toBeInTheDocument()
    expect(screen.getByText(/fake Content/i)).toBeInTheDocument()
    expect(screen.getByText(/26 de agosto de 2021/i)).toBeInTheDocument()
  })

  it('should redirect to home if user has no active subscription', async () => {
    const mockedGetSession = mocked(getSession)
    mockedGetSession.mockResolvedValueOnce(null)

    const initialData = await getServerSideProps({
      params: { slug: 'fake-post' }
    } as any)

    expect(initialData).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )
  })

  it('should get initial data if user has active subscription', async () => {
    const mockedGetSession = mocked(getSession)
    const mockedGetPrismicClient = mocked(getPrismicClient)

    mockedGetSession.mockResolvedValueOnce({ activeSubscription: 'true' })
    mockedGetPrismicClient.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        uid: 'fake-post',
        data: {
          title: [{ type: 'heading', text: 'Fake Heading' }],
          content: [{ type: 'paragraph', text: 'Fake Paragraph' }]
        },
        last_publication_date: '08-26-2021'
      })
    } as any)

    const initialData = await getServerSideProps({
      params: { slug: 'fake-post' }
    } as any)

    expect(initialData).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'fake-post',
            title: 'Fake Heading',
            content: '<p>Fake Paragraph</p>',
            updatedAt: '26 de agosto de 2021'
          }
        }
      })
    )
  })
})

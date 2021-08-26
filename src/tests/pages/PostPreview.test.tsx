import { render, screen } from '@testing-library/react'
import { useSession, getSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'
import { getPrismicClient } from '../../services/prismic'
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]'

jest.mock('../../services/prismic')
jest.mock('next-auth/client')
jest.mock('next/router')

const __post__ = {
  slug: 'fake-post',
  title: 'Fake Title',
  content: '<p>Fake Content</p>',
  updatedAt: '26 de agosto de 2021'
}

describe('<Home /> page', () => {
  it('should redirect to full post page if user has active subscription', async () => {
    const mockedUseSession = mocked(useSession)
    const mockedUseRouter = mocked(useRouter)
    const mockedRouterPush = jest.fn()

    mockedUseSession.mockReturnValueOnce([
      { activeSubscription: 'true' },
      false
    ])
    mockedUseRouter.mockReturnValueOnce({
      push: mockedRouterPush
    } as any)

    render(<PostPreview post={__post__} />)

    expect(mockedRouterPush).toHaveBeenCalledWith('/posts/fake-post')
  })

  it('should get initial data if user has no active subscription', async () => {
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

    const initialData = await getStaticProps({
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

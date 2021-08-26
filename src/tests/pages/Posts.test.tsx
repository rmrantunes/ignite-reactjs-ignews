import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')

const __posts__ = [
  {
    slug: 'fake-slug',
    title: 'Fake Title',
    excerpt: 'Fake excerpt',
    updatedAt: '26 de agosto de 2021'
  }
]

describe('<Home /> page', () => {
  it('should render correcly', () => {
    render(<Posts posts={__posts__} />)

    expect(screen.getByText(/fake title/i)).toBeInTheDocument()
    expect(screen.getByText(/fake excerpt/i)).toBeInTheDocument()
    expect(screen.getByText(/26 de agosto de 2021/i)).toBeInTheDocument()
  })

  it('should get initial data', async () => {
    const mockedGetPrismicClient = mocked(getPrismicClient)

    mockedGetPrismicClient.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'fake-uid',
            data: {
              title: [{ type: 'heading', text: 'Fake Heading' }],
              content: [{ type: 'paragraph', text: 'Fake Paragraph' }]
            },
            last_publication_date: '08-26-2021'
          }
        ]
      })
    } as any)

    const initialData = await getStaticProps({})

    expect(initialData).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'fake-uid',
              title: 'Fake Heading',
              excerpt: 'Fake Paragraph',
              updatedAt: '26 de agosto de 2021'
            }
          ]
        }
      })
    )
  })
})

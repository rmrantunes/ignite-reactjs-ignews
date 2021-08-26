import Head from 'next/head'
import { getSession } from 'next-auth/client'
import { getPrismicClient } from 'services/prismic'

import styles from 'styles/Post.module.scss'
import { RichText } from 'prismic-dom'

type Post = {
  title: string
  content: string
  updatedAt: string
}

type PostPageProps = {
  post: Post
}

export default function Post(props: PostPageProps) {
  return (
    <>
      <Head>
        <title>{props.post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{props.post.title}</h1>
          <time>{props.post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: props.post.content }}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps = async ({ req, params }) => {
  const session = await getSession(req)
  const { slug } = params

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        // See later what this means:
        permanent: false
      }
    }
  }

  const prismic = getPrismicClient(req)
  const response = await prismic.getByUID('publication', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    )
  }

  return {
    props: { post }
  }
}

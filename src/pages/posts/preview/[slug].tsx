import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import Head from "next/head";
import { useSession } from "next-auth/client";
import { getPrismicClient } from "services/prismic";

import styles from "styles/Post.module.scss";
import { RichText } from "prismic-dom";

type PreviewPost = {
  slug: any;
  title: string;
  content: string;
  updatedAt: string;
};

type PostPreviewPageProps = {
  post: PreviewPost;
};

export default function PostPreview(props: PostPreviewPageProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.activeSubscription) router.push(`/posts${props.post.slug}`);
  }, [session]);

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
            className={[styles.postContent, styles.previewContent].join("")}
            dangerouslySetInnerHTML={{ __html: props.post.content }}
          />
          <div>
            Want to continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [
      // { params: { slug: "slug" } }
    ],
    fallback: "blocking",
  };
};

export const gerStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID("publication", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: { post },
    revalidate: 60 * 30, // 30 minutes
  };
};

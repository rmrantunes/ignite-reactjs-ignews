import Head from "next/head";
import styles from "./Posts.module.scss";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a>
            <time>22 de julho de 2021</time>
            <strong>Post title</strong>
            <p>Post minified content</p>
          </a>
        </div>
      </main>
    </>
  );
}

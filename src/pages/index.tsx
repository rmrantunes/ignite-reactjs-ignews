import Head from "next/head";
import Image from "next/image";

import avatarImg from "assets/images/avatar.svg";
import styles from "styles/Home.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | ignews</title>
      </Head>

      <main className={styles.contentContainer}>
        <div className={styles.hero}>
          <span>👏🏽 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world
          </h1>

          <p>
            Get acess to all the publications <span>for $9,90/month</span>
          </p>
        </div>

        <Image src={avatarImg} alt="Girl coding and chilling" />
      </main>
    </>
  );
}

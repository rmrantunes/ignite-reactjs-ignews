import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { SubscribeButton } from "components/SubscribeButton";

import { stripe } from "services/stripe";

import avatarImg from "assets/images/avatar.svg";
import styles from "styles/Home.module.scss";

type HomePageProps = {
  product: {
    priceId: string;
    priceText: string;
  };
};

export default function Home(props: HomePageProps) {
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
            Get acess to all the publications{" "}
            <span>for {props.product.priceText}/month</span>
          </p>

          <SubscribeButton />
        </div>
        <Image src={avatarImg} alt="Girl coding and chilling" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(
    process.env.STRAPI_PRODUCT_PRICE_ID,
    { expand: ["product"] }
  );

  const product = {
    priceId: price.id,
    priceText: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: { product },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};

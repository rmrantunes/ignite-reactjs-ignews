import { Provider as NextAuthPovider } from "next-auth/client";
import { Header } from "../components/Header";

import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <NextAuthPovider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthPovider>
  );
}

export default MyApp;

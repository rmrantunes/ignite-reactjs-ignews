import Image from "next/image";
import Link from "next/link";
import { SessionButtonLogicBoundary } from "components/SessionButton";

import logoImg from "assets/images/logo.svg";
import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.wrapper}>
      <div className={styles.container}>
        <Image src={logoImg} alt="ignews" />
        <nav>
          <Link href="/">
            <a href="#">Home</a>
          </Link>
          <Link href="/posts">
            <a>Posts</a>
          </Link>
        </nav>
        <SessionButtonLogicBoundary />
      </div>
    </header>
  );
}

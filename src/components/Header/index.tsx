import Image from "next/image";
import { SessionButtonLogicBoundary } from "components/SessionButton";
import { ActiveLink } from "components/ActiveLink";

import logoImg from "assets/images/logo.svg";
import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.wrapper}>
      <div className={styles.container}>
        <Image src={logoImg} alt="ignews" />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a href="#">Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SessionButtonLogicBoundary />
      </div>
    </header>
  );
}

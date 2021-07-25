import Image from "next/image";
import logoImg from "assets/images/logo.svg";

import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.wrapper}>
      <div className={styles.container}>
        <Image src={logoImg} alt="ignews" />
        <nav>
          <a href="#">Home</a>
          <a href="#">Posts</a>
        </nav>
      </div>
    </header>
  );
}

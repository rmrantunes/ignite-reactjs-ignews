import styles from "./SignInButton.module.scss";
import { FaGithub } from "react-icons/fa";

export function SignInButton() {
  return (
    <button className={styles.signInButton}>
      <FaGithub fill="#EBA417" />
      <span>Sign in with GitHub</span>
    </button>
  );
}

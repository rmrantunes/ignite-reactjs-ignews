import { signIn, signOut, useSession } from "next-auth/client";

import styles from "./SignInButton.module.scss";
import { FaGithub } from "react-icons/fa";

type SignInButtonProps = {
  isLoggedIn: boolean;
  username?: string;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function SignInButton(props: SignInButtonProps) {
  const handleSignAction = props.isLoggedIn ? props.onSignOut : props.onSignIn;
  const githubIconFillColor = props.isLoggedIn ? "#04D361" : "#EBA417";

  return (
    <button className={styles.signInButton} onClick={handleSignAction}>
      <FaGithub fill={githubIconFillColor} />
      <span>
        {props.isLoggedIn
          ? props.username ?? "You're logged in"
          : "Sign in with GitHub"}
      </span>
    </button>
  );
}

export function SignInButtonLogicBoundary() {
  const [session] = useSession();

  return (
    <SignInButton
      isLoggedIn={Boolean(session)}
      onSignIn={() => signIn("github")}
      onSignOut={signOut}
    />
  );
}

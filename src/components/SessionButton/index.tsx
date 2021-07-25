import { signIn, signOut, useSession } from "next-auth/client";

import styles from "./SessionButton.module.scss";
import { FaGithub } from "react-icons/fa";

type SessionButtonProps = {
  isLoggedIn: boolean;
  username?: string;
  onSignIn: () => void;
  onSignOut: () => void;
};

function SessionButton(props: SessionButtonProps) {
  const handleSignAction = props.isLoggedIn ? props.onSignOut : props.onSignIn;
  const githubIconFillColor = props.isLoggedIn ? "#04D361" : "#EBA417";

  return (
    <button className={styles.sessionButton} onClick={handleSignAction}>
      <FaGithub fill={githubIconFillColor} />
      <span>
        {props.isLoggedIn
          ? props.username ?? "You're logged in"
          : "Sign in with GitHub"}
      </span>
    </button>
  );
}

export function SessionButtonLogicBoundary() {
  const [session] = useSession();

  return (
    <SessionButton
      isLoggedIn={Boolean(session)}
      onSignIn={() => signIn("github")}
      onSignOut={signOut}
    />
  );
}

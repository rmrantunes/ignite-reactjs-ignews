import { cloneElement, ReactElement } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/dist/client/router";

type ActiveLinkProps = LinkProps & {
  activeClassName: string;
  children: ReactElement;
};

export function ActiveLink(props: ActiveLinkProps) {
  const { activeClassName, children, ...propsRest } = props;
  const router = useRouter();

  const className = router.asPath === props.href ? activeClassName : "";

  return <Link {...propsRest}>{cloneElement(children, { className })}</Link>;
}

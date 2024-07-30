"use client";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

interface TransitionLinkTypes extends LinkProps {
  children: ReactNode;
  href: string;
  scroll?: boolean;
  className?: string;
}

const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function TransitionLink({
  href,
  children,
  scroll,
  className,
  ...props
}: TransitionLinkTypes) {
  const router = useRouter();

  const handleTransition = async (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const body = document.getElementById("auth-layout");
    await wait(500);
    body?.classList.add("page-transition");
    router.push(href, { scroll });
    await wait(500);
    body?.classList.remove("page-transition");
  };

  return (
    <Link
      href={href}
      onClick={(e) => handleTransition(e)}
      className={className}
      scroll={scroll}
      {...props}
    >
      {children}
    </Link>
  );
}

"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps, MouseEvent as ReactMouseEvent } from "react";
import { usePageTransition } from "../hooks";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function TransitionLink({
  href,
  children,
  scroll,
  className,
  ...props
}: TransitionLinkProps) {
  const { transitionedPush } = usePageTransition();

  const handleTransition = async (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    transitionedPush(href);
  };

  return (
    <Link
      href={href}
      onClick={(e) => handleTransition(e)}
      className={cn("", className)}
      scroll={scroll}
      {...props}
    >
      {children}
    </Link>
  );
}

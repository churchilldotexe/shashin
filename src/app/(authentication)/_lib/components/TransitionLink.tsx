"use client";

import { animatedRouterPush, cn } from "@/lib/utils";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEvent as ReactMouseEvent, type ReactNode, useState } from "react";

interface TransitionLinkTypes extends LinkProps {
  children: ReactNode;
  href: string;
  scroll?: boolean;
  className?: string;
}

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
    animatedRouterPush().then(() => router.push(href));
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

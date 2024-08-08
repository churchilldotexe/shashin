"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export function BookmarkOrFavoritedButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
}) {
  return (
    <button type="submit" onClick={(e) => e.stopPropagation()} {...props}>
      {children}
    </button>
  );
}

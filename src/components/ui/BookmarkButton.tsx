"use client";

import { cn, createTooltipClasses } from "@/lib/utils";
import type { ReactNode } from "react";

export function BookmarkButton({ children }: { children: ReactNode }) {
  return (
    <button
      className={cn(createTooltipClasses("hover:after:content-['Bookmark']"))}
      type="submit"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </button>
  );
}

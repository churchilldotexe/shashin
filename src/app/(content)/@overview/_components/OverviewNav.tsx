"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export default function OverviewNav() {
  const selectedSegment = useSelectedLayoutSegment();
  return (
    <div className="flex items-center justify-center">
      <Link
        href="/"
        scroll={false}
        className={cn(
          "rounded-md border border-white/0 hocus-visible:border-border p-2 active:scale-95 ",
          {
            "scale-105 bg-gradient-to-br from-white/10 to-white/0 shadow-[0_8px_6px_0_rgba(0,0,0,0.37)] backdrop-blur-sm transition-all dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.10)]":
              selectedSegment === null,
          }
        )}
      >
        Overview
      </Link>
      <span className="h-10 border border-border shadow-inner " />
      <Link
        href="/recent"
        scroll={false}
        className={cn(
          "rounded-md border border-white/0 hocus-visible:border-border p-2 active:scale-95 ",
          {
            "scale-105 bg-gradient-to-br from-white/10 to-white/0 shadow-[0_8px_6px_0_rgba(0,0,0,0.37)] backdrop-blur-sm transition-all dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.10)]":
              selectedSegment === "recent",
          }
        )}
      >
        recent
      </Link>
    </div>
  );
}

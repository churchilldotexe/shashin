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
        className={cn("px-4 py-2 text-lg hover:bg-gray-200/50 dark:hover:bg-white/20", {
          " scale-105 rounded bg-gray-200/50 text-accent-foreground shadow-md shadow-gray-950 transition-transform delay-700 active:scale-105 dark:bg-white/20 dark:shadow-secondary":
            selectedSegment === null,
        })}
      >
        Overview
      </Link>
      <span className="h-10 border border-border shadow-inner " />
      <Link
        href="/recent"
        scroll={false}
        className={cn("px-4 py-2 text-lg hover:bg-gray-200/50 dark:hover:bg-white/20 ", {
          " scale-105 rounded bg-gray-200/50 text-accent-foreground shadow-md shadow-gray-950 transition-transform delay-700 dark:bg-white/20 dark:shadow-secondary":
            selectedSegment === "recent",
        })}
      >
        recent
      </Link>
    </div>
  );
}

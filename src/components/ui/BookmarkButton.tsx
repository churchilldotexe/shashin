"use client";

import { setBookmarkPost, unBookmarkPost } from "@/app/(content)/_lib/Actions";
import { Bookmark } from "lucide-react";
import { type ButtonHTMLAttributes, type ReactNode, useTransition } from "react";

export function BookmarkButton({
  isBookmark,
  postId,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  isBookmark: boolean;
  postId: string;
}) {
  const [isPending, startTransition] = useTransition();
  return isBookmark ? (
    <button
      type="button"
      onClick={(e) => {
        startTransition(async () => {
          e.stopPropagation();
          e.preventDefault();
          await unBookmarkPost(postId);
        });
      }}
      {...props}
    >
      <abbr title="Bookmark">
        {isPending ? <Bookmark /> : <Bookmark className="fill-primary" />}
      </abbr>
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        startTransition(async () => {
          e.stopPropagation();
          e.preventDefault();
          await setBookmarkPost(postId);
        });
      }}
      {...props}
    >
      <abbr title="Bookmark">
        {isPending ? <Bookmark className="fill-primary" /> : <Bookmark />}
      </abbr>
    </button>
  );
}

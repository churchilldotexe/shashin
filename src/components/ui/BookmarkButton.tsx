"use client";

import { setBookmarkPost, unBookmarkPost } from "@/app/(content)/_lib/Actions";
import { useTransitionedServerAction } from "@/lib/hooks";
import { Bookmark } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

export function BookmarkButton({
  isBookmark,
  postId,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  isBookmark: boolean;
  postId: string;
}) {
  // const [isPending, startTransition] = useTransition();
  const { isPending, startServerTransition } = useTransitionedServerAction();
  return isBookmark ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        startServerTransition(unBookmarkPost(postId));
      }}
      {...props}
    >
      <abbr title="Bookmark">
        {isPending ? (
          <Bookmark className="drop-shadow-sm-double" />
        ) : (
          <Bookmark className="fill-primary drop-shadow-sm-double " />
        )}
      </abbr>
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        startServerTransition(setBookmarkPost(postId));
      }}
      {...props}
    >
      <abbr title="Bookmark">
        {isPending ? (
          <Bookmark className="fill-primary drop-shadow-sm-double" />
        ) : (
          <Bookmark className="drop-shadow-sm-double" />
        )}
      </abbr>
    </button>
  );
}

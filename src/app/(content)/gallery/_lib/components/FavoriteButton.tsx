"use client";

import { useTransitionedServerAction } from "@/lib/hooks";
import { Star } from "lucide-react";
import type { ComponentProps } from "react";
import { setFavoritePost, unFavoritePost } from "../action";

type FavoriteButtonProps = ComponentProps<"button"> & {
  isFavorited: boolean;
  imageId: string;
};

export function FavoriteButton({ isFavorited, imageId, ...props }: FavoriteButtonProps) {
  const { isPending, startServerTransition } = useTransitionedServerAction();

  return isFavorited ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        startServerTransition(unFavoritePost(imageId));
      }}
      {...props}
    >
      <abbr title="Favorite">
        {isPending ? (
          <Star className="drop-shadow-sm-double" />
        ) : (
          <Star className="fill-primary drop-shadow-sm-double" />
        )}
      </abbr>
    </button>
  ) : (
    // drop-shadow-[0_1px_1px_hsl(var(--foreground))]
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        startServerTransition(setFavoritePost(imageId));
      }}
      {...props}
    >
      <abbr title="Favorite">
        {isPending ? (
          <Star className="fill-primary drop-shadow-sm-double" />
        ) : (
          <Star className="drop-shadow-sm-double" />
        )}
      </abbr>
    </button>
  );
}

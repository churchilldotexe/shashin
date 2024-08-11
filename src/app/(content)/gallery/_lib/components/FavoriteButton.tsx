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
      <abbr title="Favorite">{isPending ? <Star /> : <Star className="fill-primary" />}</abbr>
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        startServerTransition(setFavoritePost(imageId));
      }}
      {...props}
    >
      <abbr title="Favorite">{isPending ? <Star className="fill-primary" /> : <Star />}</abbr>
    </button>
  );
}

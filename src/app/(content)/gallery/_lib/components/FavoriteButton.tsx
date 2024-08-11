"use client";

import { Star } from "lucide-react";
import { type ComponentProps, useTransition } from "react";
import { setFavoritePost, unFavoritePost } from "../action";

type FavoriteButtonProps = ComponentProps<"button"> & {
  isFavorited: boolean;
  imageId: string;
};

export function FavoriteButton({ isFavorited, imageId, ...props }: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();

  return isFavorited ? (
    <button
      type="button"
      onClick={(e) => {
        startTransition(async () => {
          e.stopPropagation();
          e.preventDefault();
          await unFavoritePost(imageId);
        });
      }}
      {...props}
    >
      <abbr title="Favorite">{isPending ? <Star /> : <Star className="fill-primary" />}</abbr>
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        startTransition(async () => {
          e.stopPropagation();
          e.preventDefault();
          await setFavoritePost(imageId);
        });
      }}
      {...props}
    >
      <abbr title="Favorite">{isPending ? <Star className="fill-primary" /> : <Star />}</abbr>
    </button>
  );
}

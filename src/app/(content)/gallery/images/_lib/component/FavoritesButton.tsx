"use client";

import { Star } from "lucide-react";
import { type ButtonHTMLAttributes, useTransition } from "react";
import { setFavoritePost, unFavoritePost } from "./action";

export function FavoriteButton({
  isFavorited,
  imageId,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  isFavorited: boolean;
  imageId: string;
}) {
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

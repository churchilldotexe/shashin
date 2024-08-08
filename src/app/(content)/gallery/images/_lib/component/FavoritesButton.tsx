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
      {isPending ? <Star /> : <Star className="fill-primary" />}
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
      {isPending ? <Star className="fill-primary" /> : <Star />}
    </button>
  );
}

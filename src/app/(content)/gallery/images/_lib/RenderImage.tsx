"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { type ButtonHTMLAttributes, useTransition } from "react";
import { setFavoritePost, unFavoritePost } from "./action";

function FavoriteButton({
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

type myImages = {
  id: string;
  name: string;
  url: string;
  fileKey: string;
  isFavorited: boolean;
};

type RenderImageProps = {
  myImages: myImages[];
};

export default function RenderImage({ myImages }: RenderImageProps) {
  return (
    <>
      {myImages.map((image) => (
        <figure key={image.fileKey} className="flex-grow basis-full md:basis-2/3 lg:basis-1/3 ">
          <figcaption className="sr-only">{image.name}</figcaption>
          <div key={image.fileKey} className="relative aspect-video ">
            <Image src={image.url} alt={image.name} className="object-cover object-center " fill />
            <FavoriteButton
              isFavorited={image.isFavorited}
              imageId={image.id}
              className="absolute top-0 right-0"
            />
          </div>
        </figure>
      ))}
    </>
  );
}

"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { CSSProperties } from "react";
import { FavoriteButton } from "../../_lib/components/FavoriteButton";
import type { SortStatusTypes } from "../../_lib/components/SortDropDown";
import { VIEW_STATUS } from "../../_lib/constants";

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
  const view = useSearchParams().get("view") as SortStatusTypes;
  return (
    <>
      {myImages.map((image, index) => {
        const favoriteStatustus = image.isFavorited ? "favorited" : "unfavorited";
        return (
          <figure
            key={image.fileKey}
            className={cn("fade-in-image flex-grow basis-full md:basis-[33%] ", VIEW_STATUS[view])}
            style={{ "--i": `${index}` } as CSSProperties}
          >
            <figcaption className="sr-only">{image.name}</figcaption>
            <div key={image.fileKey} className="relative aspect-video ">
              <Image
                src={image.url}
                alt={image.name}
                className="object-cover object-center "
                fill
              />
              <FavoriteButton
                isFavorited={image.isFavorited}
                imageId={image.id}
                className="mydiv absolute top-0 left-0"
                data-key={image.fileKey}
                data-is-favorited={favoriteStatustus}
              />
            </div>
          </figure>
        );
      })}
    </>
  );
}

"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { CSSProperties } from "react";
import { FavoriteButton } from "../../_lib/components/FavoriteButton";
import {
  type SortOptionsTypes,
  type SortPropertiesTypes,
  type SortStatusKeysTypes,
  VIEW_STATUS,
} from "../../_lib/constants";
import { sortMyArray } from "../utils";
import { DeleteImageButton } from "./DeleteImageButton";

type myImages = {
  id: string;
  name: string;
  url: string;
  fileKey: string;
  isFavorited: boolean;
  updatedAt: Date;
  createdAt: Date;
};

type RenderImageProps = {
  myImages: myImages[];
};

export default function RenderImage({ myImages }: RenderImageProps) {
  const view = useSearchParams().get("view") as SortStatusKeysTypes;
  const sortValue = useSearchParams().get("sort") as SortPropertiesTypes;
  const sortOption = useSearchParams().get("option") as SortOptionsTypes;

  const sortedImages = sortMyArray({
    order: sortOption ?? "DESC",
    sortReference: sortValue ?? "createdAt",
    arr: myImages,
  });

  return (
    <div className={cn("grid size-full grid-cols-1 gap-2 md:grid-cols-2", VIEW_STATUS[view])}>
      {sortedImages.map((image, index) => {
        const favoriteStatustus = image.isFavorited ? "favorited" : "unfavorited";
        return (
          <figure
            key={image.fileKey}
            className="fade-in-image"
            style={{ "--i": `${index}` } as CSSProperties}
          >
            <figcaption className="sr-only">{image.name}</figcaption>
            <div key={image.fileKey} className="group/img relative aspect-video">
              <Image
                src={image.url}
                alt={image.name}
                className=" rounded object-cover object-center"
                fill
              />
              <DeleteImageButton
                className="absolute top-0 left-0 hidden p-2 group-hover/img:block group-focus-visible:/img:block"
                url={image.url}
                imageId={image.id}
                imageName={image.name}
              />
              <FavoriteButton
                isFavorited={image.isFavorited}
                imageId={image.id}
                className=" absolute top-0 right-0 hidden p-2 group-hover/img:block group-focus-visible:/img:block"
              />
              <h3 className="absolute bottom-0 hidden w-full text-center font-semibold text-gray-950 backdrop-blur first-letter:capitalize group-hover/img:block group-focus-visible:/img:block ">
                {image.name}
              </h3>
            </div>
          </figure>
        );
      })}
    </div>
  );
}

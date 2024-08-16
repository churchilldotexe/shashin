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

const sortMyArray = <T extends Record<string, string | Date | boolean | number>>({
  arr,
  sortReference,
  order,
}: {
  arr: T[];
  sortReference: keyof T;
  order: "ASC" | "DESC";
}) => {
  return arr.sort((a, b) => {
    const aValue = a[sortReference];
    const bValue = b[sortReference];

    if (typeof aValue === "string" && typeof bValue === "string") {
      if (order === "ASC") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
    }
    if (aValue instanceof Date && bValue instanceof Date) {
      return order === "ASC"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    return 0;
  });
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
    <>
      {sortedImages.map((image, index) => {
        const favoriteStatustus = image.isFavorited ? "favorited" : "unfavorited";
        return (
          <figure
            key={image.fileKey}
            className={cn(" fade-in-image flex-grow basis-full md:basis-[33%] ", VIEW_STATUS[view])}
            style={{ "--i": `${index}` } as CSSProperties}
          >
            <figcaption className="sr-only">{image.name}</figcaption>
            <div key={image.fileKey} className="group/img relative aspect-video">
              <Image
                src={image.url}
                alt={image.name}
                className=" object-cover object-center "
                fill
              />
              <DeleteImageButton
                className="absolute top-0 left-0 hidden p-2 group-hover/img:block"
                url={image.url}
                imageId={image.id}
                imageName={image.name}
              />
              <FavoriteButton
                isFavorited={image.isFavorited}
                imageId={image.id}
                className=" absolute top-0 right-0 hidden p-2 group-hover/img:block"
              />
            </div>
          </figure>
        );
      })}
    </>
  );
}

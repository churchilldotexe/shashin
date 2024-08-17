"use client";

import Loading from "@/app/(content)/loading";
import { ImageSlider } from "@/components/ImageSlider";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { type CSSProperties, Suspense } from "react";
import {
  type SortOptionsTypes,
  type SortPropertiesTypes,
  type SortStatusKeysTypes,
  VIEW_STATUS,
} from "../constants";
import { sortMyArray } from "../utils";

type RenderAlbumsTypes = {
  name: string;
  url: string[];
  createdAt: Date;
  updatedAt: Date;
};
type RenderAlbumsProps = {
  myAlbums: RenderAlbumsTypes[];
};

export default function RenderAlbums({ myAlbums }: RenderAlbumsProps) {
  const view = useSearchParams().get("view") as SortStatusKeysTypes;
  const sortValue = useSearchParams().get("sort") as SortPropertiesTypes;
  const sortOption = useSearchParams().get("option") as SortOptionsTypes;

  const sortedAlbums = sortMyArray({
    order: sortOption ?? "DESC",
    sortReference: sortValue ?? "createdAt",
    arr: myAlbums,
  });

  return (
    <div className={cn("grid size-full grid-cols-1 gap-4 md:grid-cols-2", VIEW_STATUS[view])}>
      {sortedAlbums.map((album, index) => {
        return (
          <Suspense key={album.name} fallback={<Loading />}>
            <article
              className={cn(
                "fade-in-image w-full space-y-2 rounded-lg border bg-background p-3 text-foreground shadow-[0_8px_6px_0_rgba(0,0,0,0.37),-6px_-4px_10px_white] md:p-6 dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]"
              )}
              style={{ "--i": `${index}` } as CSSProperties}
            >
              <header className="w-full">
                <h1 className=" text-center font-semibold text-3xl capitalize">{album.name}</h1>
              </header>
              <figure>
                <figcaption className="sr-only">{`images for album: ${album.name}`}</figcaption>
                <ImageSlider url={album.url} />
              </figure>
            </article>
          </Suspense>
        );
      })}
    </div>
  );
}

import { getAllMyFavoritedImages } from "@/server/use-cases/favorites-use-case";
import Image from "next/image";
import { Suspense } from "react";
import { FavoriteButton } from "../_lib/components/FavoriteButton";

export default async function FavoritesPage() {
  console.log("favorite page");
  const myFavoritedImages = await getAllMyFavoritedImages();
  return (
    <section className="flex flex-wrap gap-4">
      {myFavoritedImages.length === 0 ? (
        <div>no image yet</div>
      ) : (
        <Suspense>
          {myFavoritedImages.map((image) => (
            <div
              key={image.fileKey}
              className="relative aspect-video flex-grow basis-full md:basis-2/3 lg:basis-1/3"
            >
              <Image
                src={image.url}
                alt={image.name}
                className="object-cover object-center "
                fill
              />
              <FavoriteButton
                isFavorited={image.isFavorited}
                imageId={image.id}
                className="absolute top-0 right-0"
              />
            </div>
          ))}
        </Suspense>
      )}
    </section>
  );
}

// NOTE: the same with the images but instead the images and are favorited (probably new table for the list of the images that was tagged favorite)
// RELATION: user can have (one(favorite) to one(image)) like images can only be favorited once

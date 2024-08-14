import { getAllMyFavoritedImages } from "@/server/use-cases/favorites-use-case";
import Image from "next/image";
import { type CSSProperties, Suspense } from "react";
import Loading from "../../loading";
import { FavoriteButton } from "../_lib/components/FavoriteButton";
import RenderImage from "../_lib/components/RenderImage";

export default async function FavoritesPage() {
  const myFavoritedImages = await getAllMyFavoritedImages();
  return (
    <section className="flex flex-wrap gap-4">
      {myFavoritedImages.length === 0 ? (
        <div>no image yet</div>
      ) : (
        <Suspense fallback={<Loading />}>
          <RenderImage myImages={myFavoritedImages} />
        </Suspense>
      )}
    </section>
  );
}

// NOTE: the same with the images but instead the images and are favorited (probably new table for the list of the images that was tagged favorite)
// RELATION: user can have (one(favorite) to one(image)) like images can only be favorited once

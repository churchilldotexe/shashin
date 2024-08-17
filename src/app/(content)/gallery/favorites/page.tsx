import { NoImage } from "@/components/EmptyFile";
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
        <div className="flex size-full flex-col items-center justify-center gap-4 p-8">
          <NoImage
            title="No Favorited Image Yet"
            description="There is no Favorited Image to display this time. Try Favoriting Your Image."
            href="/gallery/images"
            linkDescription="Go to Images"
          />
        </div>
      ) : (
        <Suspense fallback={<Loading />}>
          <RenderImage myImages={myFavoritedImages} />
        </Suspense>
      )}
    </section>
  );
}

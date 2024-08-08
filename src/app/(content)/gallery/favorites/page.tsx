import { BookmarkOrFavoritedButton } from "@/components/ui/BookmarkButton";
import {
  createNewFavorite,
  getAllMyFavoritedImages,
  removeFavorite,
} from "@/server/use-cases/favorites-use-case";
import { Star } from "lucide-react";
import { revalidatePath } from "next/cache";
import Image from "next/image";

export default async function FavoritesPage() {
  const myFavoritedImages = await getAllMyFavoritedImages();
  return (
    <section className="flex flex-wrap gap-4">
      {myFavoritedImages.length === 0 ? (
        <div>no image yet</div>
      ) : (
        myFavoritedImages.map((image) => (
          <div
            key={image.fileKey}
            className="relative aspect-video flex-grow basis-full md:basis-2/3 lg:basis-1/3"
          >
            <Image src={image.url} alt={image.name} className="object-cover object-center " fill />
            {image.isFavorited ? (
              <form
                action={async () => {
                  "use server";
                  await removeFavorite(image.id);
                  revalidatePath("/gallery/images");
                }}
                className="absolute top-0 right-0"
              >
                <BookmarkOrFavoritedButton className="text-secondary">
                  <Star className="fill-primary" />
                </BookmarkOrFavoritedButton>
              </form>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await createNewFavorite(image.id);
                  revalidatePath("/gallery/images");
                }}
                className="absolute top-0 right-0"
              >
                <BookmarkOrFavoritedButton className="text-secondary">
                  <Star />
                </BookmarkOrFavoritedButton>
              </form>
            )}
          </div>
        ))
      )}
    </section>
  );
}

// NOTE: the same with the images but instead the images and are favorited (probably new table for the list of the images that was tagged favorite)
// RELATION: user can have (one(favorite) to one(image)) like images can only be favorited once

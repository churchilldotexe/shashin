import { BookmarkOrFavoritedButton } from "@/components/ui/BookmarkButton";
import { createNewFavorite, removeFavorite } from "@/server/use-cases/favorites-use-case";
import { getMyImages } from "@/server/use-cases/images-use-cases";
import { Star } from "lucide-react";
import { revalidatePath } from "next/cache";
import Image from "next/image";

export default async function ImagesPage() {
  const myImages = await getMyImages();
  return (
    <section className="flex flex-wrap gap-4">
      {myImages.length === 0 ? (
        <div>no image yet</div>
      ) : (
        myImages.map((image) => (
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

// NOTE: FEAT: be able to have a view options (large, extra large, details/list) // can control with flex-basis
// add feature to delete post, image,album

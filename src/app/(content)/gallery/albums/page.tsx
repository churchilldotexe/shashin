import { NoFile } from "@/components/EmptyFile";
import { ImageSlider } from "@/components/ImageSlider";
import { PageSection } from "@/components/PageSection";
import { cn } from "@/lib/utils";
import { getAllMyAlbums } from "@/server/use-cases/albums-use-cases";
import { type CSSProperties, Suspense } from "react";
import Loading from "../../loading";
import RenderAlbums from "../_lib/components/RenderAlbum";
import { SortStatusKeysTypes, VIEW_STATUS } from "../_lib/constants";

export default async function AlbumsPage({
  searchParams: { view },
}: {
  searchParams: { view: string | undefined };
}) {
  const myAlbums = await Promise.allSettled(await getAllMyAlbums());

  console.log(view, "album page");
  return (
    <PageSection className="space-y-4 md:p-4">
      <Suspense fallback={<Loading />}>
        {myAlbums.length === 0 ? (
          <div className=" h-full ">
            <NoFile
              title="No Albums Yet"
              description="There is no Album to display this time. Try Posting some and add to album"
            />
          </div>
        ) : (
          <div className="size-full">
            <RenderAlbums
              myAlbums={myAlbums
                .filter((result) => result.status === "fulfilled")
                .map((albums) => albums.value)}
            />
          </div>
        )}
      </Suspense>
    </PageSection>
  );
}

export const dynamic = "force-dynamic";

import { userStatsUseCase } from "@/server/use-cases/user-use-cases";
import Link from "next/link";

const hrefLookup = {
  images: "/gallery/images",
  posts: "/my-posts",
  favorites: "/favorites",
  bookmarks: "/bookmarks",
  albums: "/gallery/albums",
};

export default async function Default() {
  const userStats = await userStatsUseCase();
  return (
    <aside className="flex h-fit flex-col justify-center gap-4 rounded-md shadow-elevate-light dark:shadow-elevate-dark">
      <h2 className="size-full scale-105 rounded-md border bg-gradient-to-br from-natural/10 to-natural/0 p-2 text-center shadow-elevate-light backdrop-blur-sm transition-all dark:shadow-elevate-dark ">
        Your Stats
      </h2>
      <div>
        {Object.entries(userStats).map(([key, value]) => (
          <Link
            href={hrefLookup[key as keyof typeof hrefLookup]}
            className="flex gap-2 border bg-background p-2 transition-transform active:scale-95"
            key={key}
          >
            <h3 className="capitalize">{key}:</h3>
            <p> {value}</p>
          </Link>
        ))}
      </div>
    </aside>
  );
}

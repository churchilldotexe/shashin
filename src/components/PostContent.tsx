import { cn, dateTimeFormat } from "@/lib/utils";
import { createNewBookmark, removeBookmark } from "@/server/use-cases/bookmarks-use-case";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { revalidatePath } from "next/cache";
import { type CSSProperties, type HTMLAttributes, type ReactNode, Suspense } from "react";
import { AvatarWithFallBack } from "./AvatarWithFallBack";
import { ImageSlider } from "./ImageSlider";
import { BookmarkButton } from "./ui/BookmarkButton";

type ContentType = {
  id: string;
  index?: number;
  name: string;
  createdAt: Date;
  description: string;
  avatarUrl?: string | null;
  url: string[];
  unoptimize?: boolean;
  isBookmarked: boolean;
};

type PostContentType = {
  postContent: ContentType;
} & HTMLAttributes<HTMLDialogElement>;

// FIX: add ability to bookmarks with optimistic update
// [] - make a better date (like today if the same day otherwise put a day e.g. sunday 8/25)

function AddOrDeleteBookmark({
  children,
  fn,
}: {
  children: ReactNode;
  fn: Promise<void>;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await fn;
        revalidatePath("/");
      }}
    >
      <BookmarkButton>{children}</BookmarkButton>
    </form>
  );
}

export default function PostContent({ postContent, className, ...props }: PostContentType) {
  const { id, url, unoptimize, index, description, createdAt, name, avatarUrl, isBookmarked } =
    postContent;
  return (
    <article
      className={cn(
        "fade-in-image w-full space-y-2 rounded-lg border bg-background p-3 text-foreground shadow-[0_8px_6px_0_rgba(0,0,0,0.37),-6px_-4px_10px_white] md:p-6 dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]",
        className
      )}
      style={{ "--i": `${index}` } as CSSProperties}
      {...props}
    >
      <header className="flex scale-100 items-center justify-between gap-2 text-foreground capitalize">
        <div className="flex items-center gap-4">
          <AvatarWithFallBack avatar={avatarUrl} displayName={name} className="" />

          <h1 className="mr-auto ml-0">{name}</h1>
        </div>

        <div className="z-50 flex gap-4">
          {isBookmarked ? (
            <AddOrDeleteBookmark fn={removeBookmark(id)}>
              <BookmarkCheck />
            </AddOrDeleteBookmark>
          ) : (
            <AddOrDeleteBookmark fn={createNewBookmark(id)}>
              <Bookmark />
            </AddOrDeleteBookmark>
          )}

          <time dateTime={new Date(createdAt).toISOString()}>{dateTimeFormat(createdAt)}</time>
        </div>
      </header>

      <figure className="space-y-4">
        <figcaption className="capital-first-letter">{description}</figcaption>

        <ImageSlider
          className="m-auto size-full md:size-[85%]"
          url={url}
          unoptimized={unoptimize}
        />
      </figure>
    </article>
  );
}

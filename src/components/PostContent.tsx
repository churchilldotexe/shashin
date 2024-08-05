import { cn } from "@/lib/utils";
import type { CSSProperties, HTMLAttributes } from "react";
import { AvatarWithFallBack } from "./AvatarWithFallBack";
import { ImageSlider } from "./ImageSlider";

type ContentType = {
  index?: number;
  name: string;
  createdAt: Date;
  description: string;
  avatarUrl?: string | null;
  url: string[];
  unoptimize?: boolean;
};

type PostContentType = {
  postContent: ContentType;
} & HTMLAttributes<HTMLDialogElement>;

// FIX: add ability to bookmarks with optimistic update
// [] - make a better date (like today if the same day otherwise put a day e.g. sunday 8/25)

export default function PostContent({ postContent, className, ...props }: PostContentType) {
  const { url, unoptimize, index, description, createdAt, name, avatarUrl } = postContent;
  return (
    <article
      className={cn(
        "fade-in-image w-full space-y-2 rounded-lg border bg-background p-3 text-foreground shadow-[0_8px_6px_0_rgba(0,0,0,0.37),-6px_-4px_10px_white] md:p-6 dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]",
        className
      )}
      style={{ "--i": `${index}` } as CSSProperties}
      {...props}
    >
      <header className="flex scale-100 items-center justify-between gap-2 text-foreground">
        <AvatarWithFallBack avatar={avatarUrl} displayName={name} className="" />
        <h1 className="mr-auto ml-0">{name}</h1>
        <time dateTime={new Date(createdAt).toISOString()}>
          {new Date(createdAt).toLocaleDateString()}
        </time>
      </header>
      <figure className="space-y-4">
        <figcaption>{description}</figcaption>
        <ImageSlider
          className="m-auto size-full md:size-[85%]"
          url={url}
          unoptimized={unoptimize}
        />
      </figure>
    </article>
  );
}

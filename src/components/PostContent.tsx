import { cn } from "@/lib/utils";
import type { CSSProperties, HTMLAttributes } from "react";
import { ImageSlider } from "./ImageSlider";

type ContentType = {
  index?: number;
  name: string;
  createdAt: Date;
  description: string;
  url: string[];
  unoptimize?: boolean;
};

type PostContentType = {
  postContent: ContentType;
} & HTMLAttributes<HTMLDialogElement>;

export default function PostContent({ postContent, className, ...props }: PostContentType) {
  const { url, unoptimize, index, description, createdAt, name } = postContent;
  return (
    <article
      className={cn(
        "fade-in-image size-full rounded-lg border border-border bg-background text-foreground shadow-[0_8px_6px_0_rgba(0,0,0,0.37),-6px_-4px_10px_white] md:p-6 dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]",
        className
      )}
      style={{ "--i": `${index}` } as CSSProperties}
      {...props}
    >
      <header className="flex scale-100 items-center justify-between text-foreground">
        <h1 className="">{name}</h1>
        <time dateTime={new Date(createdAt).toISOString()}>
          {new Date(createdAt).toLocaleDateString()}
        </time>
      </header>
      <figure>
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

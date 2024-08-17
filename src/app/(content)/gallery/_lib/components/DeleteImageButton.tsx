"use client";

/// <reference types="react/canary" />
import { useTransitionedServerAction } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import type { ComponentProps } from "react";
import { deleteImageAction } from "../action";

type DeleteImageButtonProps = ComponentProps<"button"> & {
  imageId: string;
  imageName: string;
  url: string;
};

export function DeleteImageButton({
  className,
  imageName,
  url,
  imageId,
  ...props
}: DeleteImageButtonProps) {
  const { isPending, startServerTransition } = useTransitionedServerAction();

  return (
    <>
      <button
        type="button"
        className={cn(
          "hocus-visible:scale-110 text-destructive drop-shadow-sm-double active:scale-95",
          className
        )}
        //@ts-ignore as per react github implemented react/canary for ignore
        popovertarget={url}
        {...props}
      >
        <X />
      </button>

      <div
        id={url}
        className={cn(
          "space-y-2 rounded-md bg-background p-4 font-medium text-foreground shadow-elevate-light dark:shadow-elevate-dark",
          "popover-transition backdrop:bg-neutral-50/20 backdrop:backdrop-blur-[3px] backdrop:dark:bg-neutral-950/20 "
        )}
        popover=""
      >
        <p className="max-w-[30ch]">
          Delete image: <strong className="text-destructive">{imageName}</strong>? <br /> This may
          delete the post if it's the only image. Proceed?
        </p>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className={cn(
              "hocus-visible:scale-105 rounded-md bg-destructive p-2 active:scale-95 ",
              {
                "bg-muted": isPending,
              }
            )}
            onClick={async () => {
              startServerTransition(deleteImageAction(imageId));
            }}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin text-foreground" /> : "Delete Image"}
          </button>

          <button
            className="hocus-visible:scale-105 rounded-md bg-secondary p-2 active:scale-90"
            type="button"
            //@ts-ignore as per react github implemented react/canary for ignore
            popovertarget={url}
            popovertargetaction="hide"
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
}

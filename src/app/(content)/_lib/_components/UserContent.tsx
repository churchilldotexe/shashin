"use client";

import { AvatarWithFallBack } from "@/components/AvatarWithFallBack";
/// <reference types="react/canary" />
import { cn } from "@/lib/utils";
import Link from "next/link";
import { type ElementRef, useEffect, useRef, useState } from "react";
import { logoutAction } from "../Actions";

export function UserContent({
  userName,
  displayName,
  avatar,
}: {
  displayName: string;
  userName: string;
  avatar: string | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const detailsRef = useRef<ElementRef<"details">>(null);

  useEffect(() => {
    const abortController = new AbortController();

    document.addEventListener(
      "mousedown",
      (event: MouseEvent) => {
        if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
          detailsRef.current.open = false;
        }
      },
      {
        signal: abortController.signal,
      }
    );

    document.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        if (detailsRef.current) {
          if (event.key === "Escape" && detailsRef.current.open) {
            detailsRef.current.open = false;
          }
        }
      },
      {
        signal: abortController.signal,
      }
    );

    return () => {
      abortController.abort();
    };
  }, []);

  const handleCloseModal = () => {
    if (detailsRef.current === null) {
      return;
    }
    detailsRef.current.open = false;
  };

  return (
    <details ref={detailsRef} className="group relative size-full ">
      <summary className="cursor-pointer list-none">
        <AvatarWithFallBack className="" avatar={avatar} displayName={displayName} />
      </summary>

      <div
        className={cn(
          "absolute bottom-full left-1/2 size-fit rounded-md p-4 shadow-elevate-light backdrop-blur-[3px] [translate:-50%_0] dark:shadow-elevate-dark",
          " popover-transition "
          // "  group-open:opacity-100 group-open:scale-100  "
        )}
      >
        <div className="flex flex-col justify-center gap-4 ">
          <div>
            <h3 className="cursor-default whitespace-nowrap capitalize">{displayName}</h3>
            <Link
              href={"/my-posts"}
              onClick={() => handleCloseModal()}
              className="text-sky-500 text-xs"
            >
              @{userName}
            </Link>
          </div>
          <hr className="" />
          <button
            type="button"
            className="hocus-visible:scale-105 rounded-md bg-primary p-2 active:scale-95 "
            popovertarget="notification"
          >
            Logout
          </button>
        </div>

        <div
          id="notification"
          className={cn(
            "space-y-2 rounded-md bg-background p-4 font-medium text-foreground shadow-elevate-light dark:shadow-elevate-dark",
            "popover-transition backdrop:bg-neutral-50/20 backdrop:backdrop-blur-[3px] backdrop:dark:bg-neutral-950/20 "
          )}
          popover=""
        >
          <p className="line-clamp-2 max-w-[30ch] ">
            You're about to be logged out. Do you want to proceed?
          </p>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="hocus-visible:scale-105 rounded-md bg-primary p-2 active:scale-95 "
              onClick={async () => {
                setLoading(true);
                await logoutAction();
                setLoading(false);
                handleCloseModal();
              }}
            >
              {loading ? "loggingOut" : "Logout "}
            </button>

            <button
              className="hocus-visible:scale-105 rounded-md bg-secondary p-2 active:scale-90"
              type="button"
              popovertarget="notification"
              popovertargetaction="hide"
              onClick={() => handleCloseModal()}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </details>
  );
}

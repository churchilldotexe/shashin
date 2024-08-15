"use client";

import { useTransitionedServerAction } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
/// <reference types="react/canary" />
import Link from "next/link";
import { logoutAction } from "../Actions";

export type UserInfoType = {
  displayName: string;
  userName: string;
  avatar: string | null;
};

export function UserInfo({ userName, displayName }: UserInfoType) {
  const { isPending, startServerTransition } = useTransitionedServerAction();
  return (
    <>
      <div className="flex flex-col justify-center gap-4 ">
        <div>
          <h3 className="cursor-default whitespace-nowrap capitalize">{displayName}</h3>
          <Link href={"/my-posts"} className="text-sky-500 text-xs">
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
            className={cn("hocus-visible:scale-105 rounded-md bg-primary p-2 active:scale-95 ", {
              "bg-muted": isPending,
            })}
            onClick={async () => {
              startServerTransition(logoutAction());
            }}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin text-foreground" /> : "Logout "}
          </button>

          <button
            className="hocus-visible:scale-105 rounded-md bg-secondary p-2 active:scale-90"
            type="button"
            popovertarget="notification"
            popovertargetaction="hide"
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
}

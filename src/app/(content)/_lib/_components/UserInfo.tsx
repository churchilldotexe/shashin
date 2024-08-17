"use client";

/// <reference types="react/canary" />
import { useTransitionedServerAction } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "../Actions";

export type UserInfoType = {
  displayName: string;
  userName: string;
  avatar: string | null;
  closeDropdown?: () => void;
};

export function UserInfo({
  userName,
  displayName,
  closeDropdown,
  popoverId,
}: { popoverId: string } & Omit<UserInfoType, "avatar">) {
  const { isPending, startServerTransition } = useTransitionedServerAction();

  const handleCloseDropdown = () => {
    if (closeDropdown === undefined) return;
    closeDropdown();
  };
  return (
    <>
      <div className="flex flex-col justify-center gap-4 ">
        <div>
          <h3 className="cursor-default whitespace-nowrap capitalize">{displayName}</h3>
          <Link href={"/my-posts"} className="text-sky-500 text-xs" onClick={handleCloseDropdown}>
            @{userName}
          </Link>
        </div>
        <hr className="" />
        <button
          type="button"
          className="w-full hocus-visible:scale-105 rounded-md bg-primary p-2 active:scale-95 "
          //@ts-ignore as per react github implemented react/canary for ignore
          popovertarget={popoverId}
        >
          Logout
        </button>
      </div>

      <div
        id={popoverId}
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
              startServerTransition(logoutAction(), closeDropdown);
            }}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin text-foreground" /> : "Logout "}
          </button>

          <button
            className="hocus-visible:scale-105 rounded-md bg-secondary p-2 active:scale-90"
            type="button"
            //@ts-ignore as per react github implemented react/canary for ignore
            popovertarget={popoverId}
            popovertargetaction="hide"
            onClick={handleCloseDropdown}
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
}

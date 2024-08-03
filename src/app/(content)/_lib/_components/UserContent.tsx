"use client";

/// <reference types="react/canary" />
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { type ElementRef, useEffect, useRef, useState } from "react";
import { logoutAction } from "../Actions";

function AvatarWithFallBack({
  displayName,
  avatar,
}: {
  avatar: string | null;
  displayName: string;
}) {
  const splittedString = displayName.split(" ");
  const initials = splittedString.map((string) => string.slice(0, 1)).join("");

  return avatar ? (
    <img
      src={avatar}
      alt="profile avatar"
      className="size-8 rounded-full object-cover object-center "
    />
  ) : (
    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-foreground">
      {initials}
    </div>
  );
}

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
  const inputRef = useRef<ElementRef<"input">>(null);
  const containerRef = useRef<ElementRef<"label">>(null);
  console.log(inputRef.current, "inputref");
  console.log(containerRef.current?.contains, "label node");
  useEffect(() => {
    console.log("did i run?");
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (inputRef.current) {
          inputRef.current.checked = false;
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // TODO: User Profile
  // [x] - get the userInfo by userId
  // [x] - define new table for users for avatar
  // [] - create a userProfile action(popover)
  // [] - display user avatar as a trigger
  // [] - chekout useTransition
  // [] - list the user basic information including the logout button
  return (
    <label
      ref={containerRef}
      htmlFor="tool-tip"
      className=" tool-tip relative size-full cursor-pointer"
    >
      <input ref={inputRef} type="checkbox" id="tool-tip" className="peer sr-only" />
      <AvatarWithFallBack avatar={avatar} displayName={displayName} />
      <div
        className={cn(
          " -translate-x0/2 invisible absolute bottom-full left-full w-full opacity-0 transition-all duration-500",
          " peer-checked:visible peer-checked:opacity-100"
        )}
      >
        <div className="flex w-full flex-col justify-center">
          <h3 className="w-max cursor-default">{displayName}</h3>
          <Link href={"/my-posts"}>@{userName}</Link>
        </div>
        <button type="button" popovertarget="warning">
          logout
        </button>
        <div>
          <button
            popover=""
            id="warning"
            type="button"
            onClick={async () => {
              setLoading(true);
              await logoutAction();
              setLoading(false);
            }}
          >
            {loading ? "loggingOut" : "Logout "}
          </button>
        </div>
      </div>
    </label>
  );
}

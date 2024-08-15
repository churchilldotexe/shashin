"use client";

import { AvatarWithFallBack } from "@/components/AvatarWithFallBack";
import { useDropDownControls, useTransitionedServerAction } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { UserInfo } from "./UserInfo";

export function UserContent({
  userName,
  displayName,
  avatar,
}: {
  displayName: string;
  userName: string;
  avatar: string | null;
}) {
  const { detailsRef, closeDropdown } = useDropDownControls();

  return (
    <details ref={detailsRef} className="group relative size-full ">
      <summary className="cursor-pointer list-none">
        <AvatarWithFallBack className="" avatar={avatar} displayName={displayName} />
      </summary>

      <div
        className={cn(
          "absolute bottom-full left-1/2 size-fit rounded-md p-4 shadow-elevate-light backdrop-blur-[3px] [translate:-50%_0] dark:shadow-elevate-dark",
          " popover-transition "
        )}
      >
        <UserInfo displayName={displayName} userName={userName} closeDropdown={closeDropdown} />
      </div>
    </details>
  );
}

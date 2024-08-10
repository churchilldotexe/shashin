import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ComponentProps } from "react";

type AvatarWithFallBackProp = ComponentProps<"div"> & {
  isRounded?: boolean;
  displayName: string;
  avatar: string | null | undefined;
};

export function AvatarWithFallBack({
  displayName,
  avatar,
  className,
  isRounded = true,
}: AvatarWithFallBackProp) {
  const splittedString = displayName.split(" ");
  const initials = splittedString.map((string) => string.slice(0, 1)).join("");

  return avatar ? (
    <div className={cn("relative aspect-square size-8 ", className)}>
      <Image
        src={avatar}
        alt="profile avatar"
        className={cn(" rounded object-cover object-center", {
          "rounded-full": isRounded,
        })}
        fill
      />
    </div>
  ) : (
    <div
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-primary text-foreground uppercase",
        className
      )}
    >
      {initials}
    </div>
  );
}

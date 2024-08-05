import { cn } from "@/lib/utils";

export function AvatarWithFallBack({
  displayName,
  avatar,
  className,
}: {
  avatar: string | null | undefined;
  displayName: string;
  className: string;
}) {
  const splittedString = displayName.split(" ");
  const initials = splittedString.map((string) => string.slice(0, 1)).join("");

  return avatar ? (
    <img
      src={avatar}
      alt="profile avatar"
      className={cn("size-8 rounded-full object-cover object-center ", className)}
    />
  ) : (
    <div
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-primary text-foreground",
        className
      )}
    >
      {initials}
    </div>
  );
}

import type { HTMLAttributes } from "react";
import { HeaderContent } from "./HeaderContent";
import { Nav } from "./Nav";
import { UserContent } from "./UserContent";

export function Header({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <HeaderContent className={className} {...props}>
      <Nav className="hidden rounded-md p-1 shadow-[0_8px_6px_0_rgba(0,0,0,.37),-6px_-4px_10px_white] md:flex dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]" />
      <div className=" hidden flex-col items-center justify-end p-4 md:flex">
        {/* TODO: change this to the actual user avatar */}
        <div>user</div>
        <UserContent />
      </div>
    </HeaderContent>
  );
}

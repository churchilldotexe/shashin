import { getUserInfo } from "@/server/use-cases/user-use-cases";
import type { HTMLAttributes } from "react";
import { HeaderContents } from "./HeaderContent";
import { Nav } from "./Nav";
import { UserContent } from "./UserContent";

export async function Header({ className, ...props }: HTMLAttributes<HTMLElement>) {
  const { displayName, userName, avatar } = await getUserInfo();

  return (
    <HeaderContents className={className} {...props}>
      <Nav className="hidden rounded-md p-1 shadow-[0_8px_6px_0_rgba(0,0,0,.37),-6px_-4px_10px_white] md:flex dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]" />
      <div className=" mr-0 ml-auto hidden items-center p-4 md:block">
        <UserContent displayName={displayName} userName={userName} avatar={avatar} />
      </div>
    </HeaderContents>
  );
}

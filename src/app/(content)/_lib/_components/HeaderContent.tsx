"use client";

import { AvatarWithFallBack } from "@/components/AvatarWithFallBack";
import Dialog from "@/components/ui/Dialog";
import { DisplayModeToggle } from "@/components/ui/DisplayModeToggle";
import { cn } from "@/lib/utils";
import {
  type ComponentProps,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Nav } from "./Nav";
import { UserInfo, type UserInfoType } from "./UserInfo";

function MobileHeader({
  setScrollDirection,
  displayName,
  avatar,
  userName,
}: {
  setScrollDirection: Dispatch<SetStateAction<"down" | "up">>;
} & UserInfoType) {
  const [currentScrollPosition, setCurrentScrollPosition] = useState<number>(0);
  const isMobileRef = useRef<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();
    const isMobileCheck = () => window.innerWidth < 768;
    isMobileRef.current = isMobileCheck();

    // to ensure that will only run in mobile breakpoints(less than 768 breakpoint)
    if (isMobileRef.current === true) {
      document.addEventListener(
        "scroll",
        () => {
          const scrollPosition = window.scrollY || document.documentElement.scrollTop;

          if (scrollPosition > currentScrollPosition) {
            setScrollDirection("down");
          } else if (scrollPosition < currentScrollPosition) {
            setScrollDirection("up");
          }
          setCurrentScrollPosition(scrollPosition <= 0 ? 0 : scrollPosition);
        },
        {
          signal: abortController.signal,
        }
      );
    }

    return () => {
      abortController.abort();
    };
  }, [currentScrollPosition, setScrollDirection]);

  return (
    <div className="p-3 shadow-[0_8px_6px_0_rgba(0,0,0,0.37)] md:hidden dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.10)] ">
      <Dialog>
        <div className="grid grid-cols-3 ">
          <Dialog.Trigger>User</Dialog.Trigger>
          <div className="justify-self-center">Shashin</div>
          <div className="justify-self-end">
            <DisplayModeToggle />
          </div>
        </div>
        <div className="flex items-center justify-evenly py-2 ">
          <div>Home</div>
          <span className=" h-6 border border-border shadow-inner " />
          <div>Gallery</div>
        </div>
        <Dialog.Content className={cn("mt-0 ml-0 h-fit w-1/2 overflow-x-clip", "slide-from-left")}>
          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col items-center gap-2">
              <AvatarWithFallBack avatar={avatar} displayName={displayName} />
              <UserInfo userName={userName} displayName={displayName} />
            </div>
            <Nav />
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

type HeaderContentsProps = UserInfoType & ComponentProps<"header">;

export function HeaderContents({
  className,
  children,
  avatar,
  userName,
  displayName,
  ...props
}: HeaderContentsProps) {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");

  return (
    <header
      className={cn(
        "z-10 flex transform flex-col justify-between bg-gradient-to-br from-background/70 to-background/40 backdrop-blur-sm transition-transform",
        " md:z-0 md:transform-none md:backdrop-blur-0 md:transition-none ",
        {
          " -translate-y-96 md:translate-y-0 ": scrollDirection === "down",
        },
        {
          " translate-y-0 ": scrollDirection === "up",
        },
        className
      )}
      {...props}
    >
      <MobileHeader
        setScrollDirection={setScrollDirection}
        displayName={displayName}
        userName={userName}
        avatar={avatar}
      />
      {children}
    </header>
  );
}

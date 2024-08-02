"use client";

import Dialog from "@/components/ui/Dialog";
import { DisplayModeDropDown } from "@/components/ui/DisplayModeToggle";
import { cn } from "@/lib/utils/cn";
import {
  type Dispatch,
  type HTMLAttributes,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Nav } from "./Nav";

function MobileHeader({
  setScrollDirection,
}: {
  setScrollDirection: Dispatch<SetStateAction<"down" | "up">>;
}) {
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
            <DisplayModeDropDown />
          </div>
        </div>
        <div className="flex items-center justify-evenly py-2 ">
          <div>Home</div>
          <span className=" h-6 border border-border shadow-inner " />
          <div>Gallery</div>
        </div>
        <Dialog.Content className={cn("mt-0 ml-0 size-fit overflow-x-clip", "slide-from-left")}>
          <Nav />
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

export function HeaderContents({
  className,
  children,
  ...props
}: { children?: ReactNode } & HTMLAttributes<HTMLElement>) {
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
      <MobileHeader setScrollDirection={setScrollDirection} />
      {children}
    </header>
  );
}

"use client";

import Dialog from "@/components/ui/Dialog";
import { DisplayModeDropDown } from "@/components/ui/DisplayModeToggle";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type HTMLAttributes, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { logoutAction } from "../Actions";

const routes = ["/", "/my-posts", "/bookmarks", "/gallery"] as const;
const gallerySubRoutes = ["/gallery/albums", "/gallery/images", "/gallery/favorites"] as const;

type Routes = (typeof routes)[number];
type GallerySubRoutes = (typeof gallerySubRoutes)[number];

const getRouteName = (routeValue: Routes | GallerySubRoutes) => {
  const newRouteString = routeValue.replace("-", " ").slice(1);
  if (newRouteString === "") {
    return "home";
  }
  if (newRouteString.includes("gallery/")) {
    return newRouteString.replace("gallery/", "");
  }
  return newRouteString;
};

export function NavContent({ ...props }: HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav {...props}>
      <div className="space-y-3">
        <Link
          href={"/"}
          className="text_stroke_outline mx-auto hidden rounded-lg p-2 font-extrabold text-3xl tracking-wide backdrop-blur-sm hover:underline md:block"
        >
          Shashin
        </Link>
        <ul>
          {routes.map((route) => {
            const routeName = getRouteName(route);
            return (
              <li
                key={route}
                className={cn(
                  "rounded-md border border-white/0 hocus-visible:border-border p-2 active:scale-95 ",
                  {
                    " scale-105 border-border bg-gradient-to-br from-natural/10 to-natural/0 shadow-[0_8px_6px_0_rgba(0,0,0,.37),-6px_-4px_10px_white] backdrop-blur-sm transition-all dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black] ":
                      pathname === `${route}`,
                  }
                )}
              >
                <Link href={route} className="capitalize">
                  {routeName}
                </Link>
              </li>
            );
          })}
          <li>
            <ul>
              {gallerySubRoutes.map((subRoute) => {
                const gallerySubRoute = getRouteName(subRoute);
                return (
                  <li
                    key={subRoute}
                    className={cn(
                      "rounded-md border border-white/0 hocus-visible:border-border p-2 active:scale-95",
                      {
                        "scale-105 bg-gradient-to-br from-white/10 to-white/0 shadow-[0_8px_6px_0_rgba(0,0,0,0.37)] backdrop-blur-sm transition-all dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.10)] ":
                          pathname === `${subRoute}`,
                      }
                    )}
                  >
                    <Link href={subRoute} className="ml-4 capitalize">
                      {gallerySubRoute}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export function Header({ className, ...props }: HTMLAttributes<HTMLElement>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [currentScrollPosition, setCurrentScrollPosition] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const abortController = new AbortController();

    // to keep track if in mobile breakpoints
    document.addEventListener(
      "resize",
      () => {
        setIsMobile(window.innerWidth < 768);
      },
      { signal: abortController.signal }
    );

    // to ensure that will only run in mobile breakpoints(less than 768 breakpoint)
    if (isMobile) {
      document.addEventListener(
        "scroll",
        () => {
          const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

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
  }, [currentScrollPosition, isMobile]);

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
          <Dialog.Content className="mt-0 ml-0 size-fit overflow-x-clip">
            <NavContent />
          </Dialog.Content>
        </Dialog>
      </div>
      <NavContent className="hidden rounded-md p-1 shadow-[0_8px_6px_0_rgba(0,0,0,.37),-6px_-4px_10px_white] md:flex dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]" />
      <div className=" hidden flex-col items-center justify-end p-4 md:flex">
        {/* TODO: change this to the actual user avatar */}
        <div>user</div>
        <button
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
    </header>
  );
}

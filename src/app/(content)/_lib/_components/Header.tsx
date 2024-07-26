"use client";

import Dialog from "@/components/ui/Dialog";
import { DisplayModeDropDown } from "@/components/ui/DisplayModeToggle";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type HTMLAttributes, useState } from "react";
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
      <div>
        <Link href={"/"} className=" mx-auto hidden hover:underline md:block ">
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
                    " scale-105 border-border bg-gradient-to-br from-natural/10 to-natural/0 shadow-[0_8px_6px_0_rgba(0,0,0,.37)_inset,-6px_-4px_10px_white_inset] backdrop-blur-sm transition-all dark:shadow-[0_8px_6px_0_rgba(0,0,0,0.1)_inset,-6px_-4px_10px_black_inset] ":
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

  return (
    <header className={cn("flex flex-col justify-between", className)} {...props}>
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
      <NavContent className="hidden rounded-md bg-gradient-to-br from-white/10 to-white/0 px-1 py-2 shadow-[0_8px_6px_0_rgba(0,0,0,.37),-6px_-4px_10px_white] backdrop-blur-sm md:flex dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black] " />
      {/* <NavContent className="hidden shadow-[0_8px_6px_0_rgba(0,0,0,.37),-6px_-4px_10px_white] rounded-md md:flex dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]" /> */}
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

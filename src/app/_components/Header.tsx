"use client";

import { DisplayModeDropDown } from "@/components/ui/DisplayModeToggle";
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Dialog from "@/components/ui/Dialog";

const routes = ["/", "/my-posts", "/bookmarks", "/gallery"] as const;
const gallerySubRoutes = ["/gallery/albums", "/gallery/images", "/gallery/favorites"] as const;

type Routes = (typeof routes)[number];
type GallerySubRoutes = (typeof gallerySubRoutes)[number];

const getRouteName = (routeValue: Routes | GallerySubRoutes) => {
  const newRouteString = routeValue.replace("-", " ").slice(1);
  if (newRouteString === "") {
    return "home";
  } else if (newRouteString.includes("gallery/")) {
    return newRouteString.replace("gallery/", "");
  } else {
    return newRouteString;
  }
};

export function NavContent({ ...props }: HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav {...props}>
      <div>
        <Link href={"/"} className=" mx-auto hidden hover:underline md:block">
          Shashin
        </Link>
        <ul>
          {routes.map((route) => {
            const routeName = getRouteName(route);
            return (
              <li
                key={route}
                className={cn(
                  "rounded-md border border-white/0 p-2 active:scale-95 hocus-visible:border-border ",
                  {
                    "scale-105 bg-gradient-to-br from-white/10 to-white/0 shadow-[0_8px_6px_0_rgba(0,0,0,0.37)] backdrop-blur-sm transition-all dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.10)]":
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
                      "rounded-md border border-white/0 p-2 active:scale-95 hocus-visible:border-border",
                      {
                        "scale-105 bg-gradient-to-br from-white/10 to-white/0 shadow-[0_8px_6px_0_rgba(0,0,0,0.37)] backdrop-blur-sm transition-all dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.10)]":
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
  return (
    <header className={cn("flex flex-col justify-between", className)} {...props}>
      <div className="p-3 md:hidden">
        <Dialog>
          <div className=" grid grid-cols-3 ">
            <Dialog.Trigger>User</Dialog.Trigger>
            <div className="justify-self-center">Shashin</div>
            <div className="justify-self-end">
              <DisplayModeDropDown />
            </div>
          </div>
          <div className="sticky flex items-center justify-evenly py-2 ">
            <div>Home</div>
            <span className=" h-6 border border-border shadow-inner " />
            <div>Gallery</div>
          </div>
          <Dialog.Content className="ml-0 mt-0 size-fit overflow-x-clip">
            <NavContent />
          </Dialog.Content>
        </Dialog>
      </div>
      <NavContent className="hidden md:flex" />
      <div className="hidden md:block">User Information</div>
    </header>
  );
}

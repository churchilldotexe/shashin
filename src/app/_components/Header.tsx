"use client";

import { DisplayModeDropDown } from "@/components/ui/DisplayModeToggle";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type HTMLAttributes } from "react";

const routes = ["/", "/my-posts", "/bookmars", "/gallery"] as const;
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

export function Header({ className, ...props }: HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <header className={cn("flex flex-col justify-between", className)} {...props}>
      <div className="p-2">
        <div className="grid grid-cols-3 ">
          <div className="justify-self-start">User</div>
          <div className="justify-self-center">Shashin</div>
          <div className="justify-self-end">
            <DisplayModeDropDown />
          </div>
        </div>
        <div className="sticky flex items-center justify-evenly ">
          <div>Home</div>
          <span className="  h-6 border border-border shadow-inner " />
          <div>Gallery</div>
        </div>
      </div>
      <nav className="hidden">
        <div>
          <Link href={"/"} className="hover:underline">
            Shashin
          </Link>
          <ul>
            {routes.map((route) => {
              const routeName = getRouteName(route);
              return (
                <li
                  key={route}
                  className={cn(
                    "rounded-md border border-white/0 p-2 hocus-visible:border-border ",
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
                        "rounded-md border border-white/0 p-2 hocus-visible:border-border ",
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
      <div className="hidden">User Information</div>
    </header>
  );
}

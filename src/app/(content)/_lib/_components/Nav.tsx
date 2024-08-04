"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";

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

export function Nav({ ...props }: HTMLAttributes<HTMLElement>) {
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

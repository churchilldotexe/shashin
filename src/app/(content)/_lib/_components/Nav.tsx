"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, HTMLAttributes } from "react";

const routes = {
  main: ["/", "/my-posts", "/bookmarks", "/gallery"],
  gallerySubRoutes: ["/gallery/albums", "/gallery/images", "/gallery/favorites"],
} as const;

type Routes = (typeof routes.main)[number];
type GallerySubRoutes = (typeof routes.gallerySubRoutes)[number];

const getRouteName = (routeValue: Routes | GallerySubRoutes) => {
  const routeName = routeValue.split("/").pop() || "home";
  return routeName.replace("-", " ");
};

type LinkItemsType = {
  route: Routes | GallerySubRoutes;
  routeName: ReturnType<typeof getRouteName>;
  pathname: string;
} & ComponentProps<"a">;

function LinkItems({ route, routeName, pathname, className, ...props }: LinkItemsType) {
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
      <Link href={route} className={cn("capitalize", className)} {...props}>
        {routeName}
      </Link>
    </li>
  );
}

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
          {routes.main.map((route) => {
            const routeName = getRouteName(route);
            return (
              <LinkItems route={route} key={route} routeName={routeName} pathname={pathname} />
            );
          })}
          <li>
            <ul>
              {routes.gallerySubRoutes.map((subRoute) => {
                const gallerySubRoute = getRouteName(subRoute);
                return (
                  <LinkItems
                    className="ml-4"
                    route={subRoute}
                    routeName={gallerySubRoute}
                    pathname={pathname}
                    key={subRoute}
                  />
                );
              })}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

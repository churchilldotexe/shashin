"use client";

import { PageSection } from "@/components/PageSection";
import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

export default function AuthComponent({ children }: { children: ReactNode }) {
  return (
    <PageSection>
      <div
        id="auth-layout"
        className="grid size-full place-items-center rounded-lg px-2 sm:px-6 md:grid-cols-2 md:px-0"
      >
        <div
          // shadow-[0_8px_6px_0_rgba(0,0,0,0.1),-6px_-4px_10px_white]
          //dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]
          className={cn(
            "relative hidden size-full items-center justify-center rounded-lg bg-neutral-50/5 dark:bg-neutral-950/5 ",
            "css-border-animateAt30deg shadow-elevate-light dark:shadow-elevate-dark ",
            "md:flex"
          )}
        >
          <span className="absolute inset-0 z-[-1] m-auto h-[99%] w-[99%] rounded-lg bg-background lg:w-[99.5%] " />
          <h1 className=" text_stroke_outline rounded-lg p-4 font-extrabold text-5xl backdrop-blur-sm">
            Shashin
          </h1>
        </div>

        <div
          className={cn(
            " relative size-full rounded-xl bg-neutral-50/5 p-8 backdrop-blur-lg dark:bg-neutral-950/5 ",
            "css-border-animateAt330deg shadow-[0_8px_6px_0_rgba(0,0,0,0.1)_inset,-6px_-4px_10px_white_inset] dark:shadow-[0_8px_6px_0_rgba(250,250,250,0.1)_inset,-8px_-6px_12px_black_inset]"
          )}
        >
          <span className="absolute inset-0 z-[-1] m-auto h-[99%] w-[99.5%] rounded-lg bg-background shadow-[0_8px_6px_0_rgba(0,0,0,0.1)_inset,-6px_-4px_10px_white_inset] dark:shadow-[0_8px_6px_0_rgba(250,250,250,0.1)_inset,-8px_-6px_12px_black_inset]" />
          <h1 className="-translate-x-1/2 text_stroke_outline -top-10 absolute left-1/2 rounded-lg font-extrabold text-5xl backdrop-blur-sm md:hidden ">
            Shashin
          </h1>
          {children}
        </div>
      </div>
    </PageSection>
  );
}

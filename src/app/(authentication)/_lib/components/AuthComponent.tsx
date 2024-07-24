"use client";

import { PageSection } from "@/components/PageSection";
import type { ReactNode } from "react";

const images = ["/AZKi.png", "/furina-white.jpg", "/furina.jpeg", "/watame.png"];

export default function AuthComponent({ children }: { children: ReactNode }) {
  return (
    <PageSection>
      <div className="grid size-full grid-cols-2 place-items-center rounded-lg">
        <div className="css-border-animateAt30deg relative flex size-full items-center justify-center rounded-lg bg-neutral-50/5 shadow-[0_8px_6px_0_rgba(0,0,0,0.1),-6px_-4px_10px_white] dark:bg-neutral-950/5 dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black] ">
          <span className="absolute inset-0 z-[-1] m-auto h-[99%] w-[99.5%] rounded-lg bg-background " />
          <h1 className="p-4 text-5xl">Shashin</h1>
          {/* <Image */}
          {/*   src="/AZKi.png" */}
          {/*   className="absolute top-4 right-0 size-40 rounded-lg object-contain object-center" */}
          {/*   alt="landing page image" */}
          {/*   width={500} */}
          {/*   height={500} */}
          {/* /> */}
        </div>
        <div className="css-border-animateAt330deg size-full rounded-xl bg-neutral-50/5 p-8 shadow-[0_8px_6px_0_rgba(0,0,0,0.1)_inset,-6px_-4px_10px_white_inset] backdrop-blur-lg dark:bg-neutral-950/5 dark:shadow-[0_8px_6px_0_rgba(250,250,250,0.1)_inset,-8px_-6px_12px_black_inset] ">
          <span className="absolute inset-0 z-[-1] m-auto h-[99%] w-[99.5%] rounded-lg bg-background shadow-[0_8px_6px_0_rgba(0,0,0,0.1)_inset,-6px_-4px_10px_white_inset] dark:shadow-[0_8px_6px_0_rgba(250,250,250,0.1)_inset,-8px_-6px_12px_black_inset]" />
          {children}
        </div>
      </div>
    </PageSection>
  );
}

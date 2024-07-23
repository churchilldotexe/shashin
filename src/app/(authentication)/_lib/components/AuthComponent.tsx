"use client";

import { PageSection } from "@/components/PageSection";
import type { ReactNode } from "react";

const images = ["/AZKi.png", "/furina-white.jpg", "/furina.jpeg", "/watame.png"];

export default function AuthComponent({ children }: { children: ReactNode }) {
  return (
    <PageSection>
      <div className="rounded-lg  grid grid-cols-[1fr,auto] place-items-center">
        <div className="css-border-animateAt30deg bg-neutral-50/5 dark:bg-neutral-950/5 size-full relative flex  items-center justify-center rounded-lg shadow-[0_8px_6px_0_rgba(0,0,0,0.1),-6px_-4px_10px_white] dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]  ">
          <span className="absolute inset-0 z-[-1] rounded-lg m-auto w-[98%] h-[99%] bg-background " />
          <h1 className="text-5xl p-4">Shashin</h1>
          {/* <Image */}
          {/*   src="/AZKi.png" */}
          {/*   className="absolute top-4 right-0 size-40 rounded-lg object-contain object-center" */}
          {/*   alt="landing page image" */}
          {/*   width={500} */}
          {/*   height={500} */}
          {/* /> */}
        </div>
        <div className="css-border-animateAt330deg bg-neutral-50/5 dark:bg-neutral-950/5 backdrop-blur-lg p-8 rounded-xl shadow-[0_8px_6px_0_rgba(0,0,0,0.1)_inset,-6px_-4px_10px_white_inset]  dark:shadow-[0_8px_6px_0_rgba(250,250,250,0.1)_inset,-8px_-6px_12px_black_inset] ">
          {/* <span className="absolute left-1/2 top-1/2 [translate:-50%_-50%]  z-[-1] m-auto  rounded-lg size-[98%] bg-blue-500 " /> */}
          <span className="absolute inset-0 z-[-1] rounded-lg m-auto size-[99%] bg-background shadow-[0_8px_6px_0_rgba(0,0,0,0.1)_inset,-6px_-4px_10px_white_inset] dark:shadow-[0_8px_6px_0_rgba(250,250,250,0.1)_inset,-8px_-6px_12px_black_inset]" />
          {children}
        </div>
      </div>
    </PageSection>
  );
}

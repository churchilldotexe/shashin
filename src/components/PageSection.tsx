// (property) JSX.IntrinsicElements.section: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export function PageSection({
  className,
  children,
  ...props
}: { children: ReactNode } & HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("flex w-full flex-col items-center justify-center ", className)}
      {...props}
    >
      {children}
    </section>
  );
}

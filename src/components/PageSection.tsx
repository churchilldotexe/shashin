// (property) JSX.IntrinsicElements.section: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export function PageSection({
  className,
  children,
  ...props
}: { children: ReactNode } & HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("flex min-h-screen w-full flex-col items-center justify-center", className)}
      {...props}
    >
      {children}
    </section>
  );
}

"use client";

import { PageSection } from "@/components/PageSection";
import { type CSSProperties, useEffect } from "react";

export default function Loading() {
  useEffect(() => {
    // Reset the transition when the Loading component mounts
    document.documentElement.style.setProperty("--transition", "unset");
  }, []);

  return <PageSection>Loading.....</PageSection>;
}
// style={{ "--transition": "unset" } as CSSProperties}
// TODO: provide a better loading state

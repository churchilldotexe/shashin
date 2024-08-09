import type { CSSProperties } from "react";

export default function Loading() {
  return <div style={{ "--transition": "unset" } as CSSProperties}>Loading....</div>;
}

// style={{ "--transition": "unset" } as CSSProperties}
// TODO: provide a better loading state

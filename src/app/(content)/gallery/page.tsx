export const dynamic = "force-dynamic";

import { type RedirectType, redirect } from "next/navigation";

export default function GalleryPage() {
  redirect("/gallery/albums", "replace" as RedirectType);
}

import "@/styles/globals.css";

import { DisplayModeToggle } from "@/components/ui/DisplayModeToggle";
import { Header } from "./_lib/_components/Header";

export const metadata = {
  title: "Shashin",
  description: "An image storage and Social Gallery ",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  overview,
  modal,
}: {
  children: React.ReactNode;
  overview: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="container mx-auto flex flex-col justify-center gap-4 md:flex-row">
      <Header className="sticky top-0 w-full md:h-dvh md:w-fit" />
      <main className="size-full max-w-5xl px-2 md:px-0">
        {children}
        {modal}
        {/* <div id="modal-root" /> */}
      </main>
      <aside className="sticky top-0 hidden h-dvh md:flex">
        <div>
          <DisplayModeToggle />
        </div>
        {overview}
      </aside>
      {/* TODO: footer: can be shown in the bottom (grow the children) */}
    </div>
  );
}

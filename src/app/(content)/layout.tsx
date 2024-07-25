import "@/styles/globals.css";

import { DisplayModeDropDown } from "@/components/ui/DisplayModeToggle";
import { Header } from "./_lib/_components/Header";

export const metadata = {
  title: "Shashin",
  description: "An image storage and Social Gallery ",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  overview,
}: {
  children: React.ReactNode;
  overview: React.ReactNode;
}) {
  return (
    <div className="container mx-auto flex flex-col justify-center gap-4 md:flex-row">
      {/* TODO: mobile first: header with nav must be a toggle button in mobile first (drop down list icon only?) when md: note dropdown but show icon only */}
      {/*  TODO:  focus on designing the front page first(for signed in and welcome page(for unsigned in)) */}
      <Header className="sticky top-0 w-full md:h-dvh md:w-fit" />
      <main className="size-full max-w-5xl">{children}</main>
      <aside className="sticky top-0 hidden h-dvh md:flex">
        <div>
          <DisplayModeDropDown />
        </div>
        <div className="">{overview}</div>
      </aside>
      {/* TODO: Homepage here for signed out Users*/}
      {/* NOTE: when user logged in/signed up do an UPSERT for user table where if not yet reg add to user table and get basic info of the user to be displayed to his profile */}
      {/* TODO: footer: can be shown in the bottom (grow the children) */}
    </div>
  );
}

import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Header } from "./_components/Header";

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
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <body className="container mx-auto grid grid-cols-[auto,1fr,auto]">
        {/* TODO: mobile first: header with nav must be a toggle button in mobile first (drop down list icon only?) when md: note dropdown but show icon only */}
        {/* TODO: footer: can be shown in the bottom (grow the children) */}

        <Header className="w-fit" />
        <main className="mx-auto size-full ">{children}</main>
        <aside>{overview}</aside>
      </body>
    </html>
  );
}

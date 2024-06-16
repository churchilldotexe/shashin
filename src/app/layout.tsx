import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Header } from "./_components/Header";

export const metadata = {
  title: "Shashin",
  description: "An image storage and Social Gallery ",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="container mx-auto flex justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {/* TODO: mobile first: header with nav must be a toggle button in mobile first (drop down list icon only?) when md: note dropdown but show icon only */}
        {/* TODO: footer: can be shown in the bottom (grow the children) */}

        <Header />
        <main className="mx-auto size-full max-w-2xl">{children}</main>
      </body>
    </html>
  );
}

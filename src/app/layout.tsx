import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Header } from "./_components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { DisplayModeDropDown } from "@/components/ui/DisplayModeToggle";

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
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="container mx-auto grid grid-cols-[auto,1fr,auto] items-start">
        {/* TODO: mobile first: header with nav must be a toggle button in mobile first (drop down list icon only?) when md: note dropdown but show icon only */}

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header className="sticky top-0 h-dvh w-fit " />
          <main className="size-full">{children}</main>
          <aside className="sticky top-0 h-dvh">
            <div>
              <DisplayModeDropDown />
            </div>
            <div>{overview}</div>
          </aside>
          {/* TODO: footer: can be shown in the bottom (grow the children) */}
        </ThemeProvider>
      </body>
    </html>
  );
}

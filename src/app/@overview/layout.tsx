import { Fragment } from "react";
import OverviewNav from "./_components/OverviewNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      <OverviewNav />
      {children}
    </Fragment>
  );
}

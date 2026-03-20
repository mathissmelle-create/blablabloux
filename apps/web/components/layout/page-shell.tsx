import { PropsWithChildren } from "react";
import { TopNav } from "./top-nav";

export function PageShell({ children }: PropsWithChildren) {
  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-[1240px] px-4 pb-16 pt-8 lg:px-6">{children}</main>
    </>
  );
}

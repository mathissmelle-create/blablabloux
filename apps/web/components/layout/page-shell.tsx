import { PropsWithChildren } from "react";
import { TopNav } from "./top-nav";

export function PageShell({ children }: PropsWithChildren) {
  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </>
  );
}

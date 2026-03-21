import { ReactNode } from "react";
import { Surface } from "../ui/design-system";

type AdminPageShellProps = {
  title: string;
  description: string;
  action?: ReactNode;
  children?: ReactNode;
};

export function AdminPageShell({ title, description, action, children }: AdminPageShellProps) {
  return (
    <div className="space-y-3">
      <header className="panel-elevated p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="chip mb-2">admin control center</p>
            <h1 className="text-[28px] font-semibold text-white [font-family:var(--font-orbitron)]">{title}</h1>
            <p className="mt-1.5 max-w-3xl text-sm text-silver">{description}</p>
          </div>
          {action ?? <button className="btn-secondary">Create</button>}
        </div>
      </header>
      <Surface className="surface-grid rounded-[14px] border border-graphite/40 bg-transparent p-3">{children}</Surface>
    </div>
  );
}

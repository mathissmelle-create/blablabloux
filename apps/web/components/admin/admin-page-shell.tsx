import { ReactNode } from "react";

type AdminPageShellProps = {
  title: string;
  description: string;
  action?: ReactNode;
  children?: ReactNode;
};

export function AdminPageShell({ title, description, action, children }: AdminPageShellProps) {
  return (
    <div className="space-y-4">
      <header className="panel-elevated p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="chip mb-3">admin control center</p>
            <h1 className="text-2xl font-semibold text-white [font-family:var(--font-orbitron)]">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm text-silver">{description}</p>
          </div>
          {action ?? <button className="btn-secondary">Create</button>}
        </div>
      </header>
      {children}
    </div>
  );
}

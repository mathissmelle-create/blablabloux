import { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  action?: ReactNode;
};

export function SectionHeader({ title, subtitle, eyebrow, action }: SectionHeaderProps) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="chip mb-3">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold text-white md:text-4xl [font-family:var(--font-orbitron)]">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-silver md:text-base">{subtitle}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

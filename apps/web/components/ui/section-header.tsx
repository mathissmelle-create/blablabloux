import { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  action?: ReactNode;
};

export function SectionHeader({ title, subtitle, eyebrow, action }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? <p className="chip chip-accent mb-2">{eyebrow}</p> : null}
        <h1 className="text-[30px] font-semibold leading-tight text-white md:text-[36px] [font-family:var(--font-orbitron)]">{title}</h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-silver md:text-[15px]">{subtitle}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

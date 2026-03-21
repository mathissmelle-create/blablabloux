"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { PropsWithChildren, ReactNode } from "react";

export function Surface({
  children,
  className,
  elevated = false,
}: PropsWithChildren<{ className?: string; elevated?: boolean }>) {
  return <section className={clsx(elevated ? "panel-elevated" : "panel", className)}>{children}</section>;
}

export function MicroLabel({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <p className={clsx("text-[11px] uppercase tracking-[0.14em] text-silver", className)}>{children}</p>;
}

export function MetricTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  tone?: "default" | "accent" | "success" | "danger";
}) {
  return (
    <Surface className="p-3">
      <MicroLabel>{label}</MicroLabel>
      <p
        className={clsx("mt-1 text-xl font-semibold", {
          "text-white": tone === "default",
          "text-accent": tone === "accent",
          "text-success": tone === "success",
          "text-danger": tone === "danger",
        })}
      >
        {value}
      </p>
    </Surface>
  );
}

export function ActionStrip({ children }: PropsWithChildren) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

export function ClickCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 320, damping: 24 }} className={clsx(className)}>
      {children}
    </motion.div>
  );
}

export function KbdBadge({ children }: PropsWithChildren) {
  return <span className="chip bg-panel2/85 text-[10px]">{children}</span>;
}

export function DataRow({
  left,
  right,
  className,
}: {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center justify-between rounded-[10px] border border-graphite/70 bg-panel2/75 px-3 py-2 text-sm", className)}>
      <span className="text-silver">{left}</span>
      <span className="text-white">{right}</span>
    </div>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={clsx("skeleton rounded-[10px]", className)} />;
}

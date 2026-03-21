"use client";

import { PropsWithChildren, useState } from "react";
import clsx from "clsx";

type TiltCardProps = PropsWithChildren<{
  className?: string;
}>;

export function TiltCard({ className, children }: TiltCardProps) {
  const [transform, setTransform] = useState("perspective(1100px) rotateX(0deg) rotateY(0deg)");

  return (
    <div
      className={clsx("transition-transform duration-200 will-change-transform", className)}
      style={{ transform }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) * 2 - 1) * -6;
        const rotateY = ((x / rect.width) * 2 - 1) * 7;
        setTransform(`perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`);
      }}
      onMouseLeave={() => {
        setTransform("perspective(1100px) rotateX(0deg) rotateY(0deg)");
      }}
    >
      {children}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  return {
    d: Math.floor(ms / 86_400_000),
    h: Math.floor((ms / 3_600_000) % 24),
    m: Math.floor((ms / 60_000) % 60),
    s: Math.floor((ms / 1000) % 60),
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export function Countdown({
  target,
  size = "md",
}: {
  target: Date;
  size?: "sm" | "md" | "lg";
}) {
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const sizes = {
    sm: { num: "text-3xl md:text-4xl", lab: "text-[10px]" },
    md: { num: "text-5xl md:text-6xl", lab: "text-[11px]" },
    lg: { num: "text-6xl md:text-8xl", lab: "text-xs" },
  }[size];

  return (
    <div className="flex items-start gap-3 md:gap-6">
      <Cell num={pad(t.d)} lab="DÍAS" sizes={sizes} />
      <Sep sizes={sizes} />
      <Cell num={pad(t.h)} lab="HORAS" sizes={sizes} />
      <Sep sizes={sizes} />
      <Cell num={pad(t.m)} lab="MIN" sizes={sizes} />
      <Sep sizes={sizes} />
      <Cell num={pad(t.s)} lab="SEG" sizes={sizes} />
    </div>
  );
}

function Cell({
  num,
  lab,
  sizes,
}: {
  num: string;
  lab: string;
  sizes: { num: string; lab: string };
}) {
  return (
    <div className="flex flex-col items-center min-w-[3.5ch]">
      <span className={`font-display tabular-nums leading-none text-gradient ${sizes.num}`}>
        {num}
      </span>
      <span className={`mt-2 uppercase tracking-[0.18em] text-text-secondary ${sizes.lab}`}>
        {lab}
      </span>
    </div>
  );
}

function Sep({ sizes }: { sizes: { num: string } }) {
  return (
    <span className={`font-display leading-none text-border-dark ${sizes.num}`}>
      :
    </span>
  );
}

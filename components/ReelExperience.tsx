"use client";

import { useState } from "react";
import { useReelActive } from "./ReelActiveContext";

export interface ReelExperienceProps {
  role: string;
  company: string;
  period: string;
  highlights: string[];
  stack: string[];
  video?: React.ReactNode;
}

function toHashtag(s: string): string {
  return `#${s.replace(/(^|\s)\S/g, (c) => c.toUpperCase()).replace(/\s+/g, "")}`;
}

const STACK_COLORS: Record<string, string> = {
  "ruby on rails": "text-red-400",
  "hotwire": "text-teal-400",
  "erb": "text-rose-300",
  "sidekiq": "text-orange-400",
  "react": "text-cyan-300",
  "next.js": "text-white/80",
  "node.js": "text-green-400",
  "mongodb": "text-green-500",
  "javascript": "text-yellow-400",
  "typescript": "text-blue-400",
  "aws": "text-orange-400",
};

function stackColor(s: string): string {
  return STACK_COLORS[s.toLowerCase()] ?? "text-sky-400";
}

function StackHashtags({ stack, className = "" }: { stack: string[]; className?: string }) {
  return (
    <p className={`flex flex-wrap gap-x-2 gap-y-1 text-sm font-semibold ${className}`}>
      {stack.map((s) => (
        <span key={s} className={stackColor(s)}>{toHashtag(s)}</span>
      ))}
    </p>
  );
}

export function ReelExperience({ role, company, period, highlights, stack, video }: ReelExperienceProps) {
  const [open, setOpen] = useState(false);
  const isActive = useReelActive();
  const highlight = highlights[0];

  // Close the description sheet once this reel is scrolled away from, so it
  // can't float over whatever reel becomes active next (mirrors Reel.tsx's
  // own handling of the comment sheet).
  const [wasActive, setWasActive] = useState(isActive);
  if (isActive !== wasActive) {
    setWasActive(isActive);
    if (!isActive) setOpen(false);
  }

  return (
    <div className="relative h-full text-white">
      {video && <div className="absolute inset-0">{video}</div>}

      {/* Caption overlay — collapsed view, tap to open the full description sheet */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="absolute inset-x-0 bottom-0 cursor-pointer pt-24 pb-8 pl-4 pr-20 text-left bg-linear-to-t from-black/90 via-black/50 to-transparent"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Experience</p>
        <h2 className="mt-2 text-xl font-black tracking-tight">{company}</h2>
        <p className="mt-1 text-sm font-semibold text-white/70">{role} · {period}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/90 line-clamp-2">
          {highlight} <span className="text-white/50">… more</span>
        </p>
        <StackHashtags stack={stack} className="mt-3" />
      </div>

      {/* Full description — Instagram-style bottom sheet */}
      <div
        className={`fixed inset-0 z-30 flex flex-col justify-end transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col bg-[#18181b] rounded-t-3xl max-h-[75%]"
        >
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-9 h-1 rounded-full bg-white/20" />
          </div>
          <div className="overflow-y-auto overscroll-contain px-6 pt-2 pb-8" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Experience</p>
            <h2 className="mt-2 text-lg font-black tracking-tight">{company}</h2>
            <p className="mt-1 text-sm font-semibold text-white/70">{role} · {period}</p>
            <ul className="mt-5 flex flex-col gap-4">
              {highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-white/90">
                  <span className="mt-0.5 shrink-0 text-white/40">→</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <StackHashtags stack={stack} className="mt-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

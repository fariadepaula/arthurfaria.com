"use client";

import { useEffect } from "react";
import { useReelComments } from "./ReelCommentsContext";

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
  const { openComments, setDescription } = useReelComments();
  const highlight = highlights[0];

  // Register this reel's full description with the shared comments sheet —
  // on real Instagram the caption and comments live in the same sheet. Tap
  // the caption to see the description (plus comments below it); tap the
  // comment icon to see just the comments.
  useEffect(() => {
    setDescription(
      <div>
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
    );
  }, [company, role, period, highlights, stack, setDescription]);

  return (
    <div className="relative h-full text-white">
      {video && <div className="absolute inset-0">{video}</div>}

      {/* Gradient scrim — purely decorative, sized for the fade effect; not clickable itself */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 pt-24 pb-8 pl-4 pr-20 bg-linear-to-t from-black/90 via-black/50 to-transparent" />

      {/* Caption — tap to open the full description in the comments sheet. Only
          the actual text hugs the click target, not the gradient above it. */}
      <div
        role="button"
        tabIndex={0}
        onClick={openComments}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openComments();
          }
        }}
        className="absolute inset-x-0 bottom-0 cursor-pointer pb-8 pl-4 pr-20 text-left"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Experience</p>
        <h2 className="mt-2 text-xl font-black tracking-tight">{company}</h2>
        <p className="mt-1 text-sm font-semibold text-white/70">{role} · {period}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/90 line-clamp-2">
          {highlight} <span className="text-white/50">… more</span>
        </p>
        <StackHashtags stack={stack} className="mt-3" />
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useReelsOptional } from "./ReelsContext";
import Link from "next/link";

export interface SubstackPost {
  title: string;
  link: string;
  image: string | null;
}

const STATS = [
  { value: "8", label: "projects" },
  { value: "3+", label: "yrs exp" },
  { value: "B.Sc.", label: "degree" },
];

const LINKEDIN_URL = "https://linkedin.com/in/arfaria";

const SOCIAL_LINKS = [
  { label: "LinkedIn", icon: "/Linkedin.svg", href: LINKEDIN_URL },
  { label: "GitHub", icon: "/Github.svg", href: "https://github.com/fariadepaula" },
  { label: "Substack", icon: "/Substack.svg", href: "https://afaaafa.substack.com/" },
];

// Sized in cqw (relative to the card's own width) instead of px, so the
// whole layout scales together on any card size — mobile full-bleed or
// the fixed 9:16 desktop card — instead of looking tiny on a big screen.
const ICON_CLASS = "h-[5.6cqw] w-[5.6cqw]";

function ExperienceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className={ICON_CLASS} aria-hidden="true">
      <path d="M9 4a2 2 0 0 0-2 2v1H4.5A2.5 2.5 0 0 0 2 9.5v8A2.5 2.5 0 0 0 4.5 20h15a2.5 2.5 0 0 0 2.5-2.5v-8A2.5 2.5 0 0 0 19.5 7H17V6a2 2 0 0 0-2-2H9Zm0 2h6v1H9V6ZM4.5 9h15a.5.5 0 0 1 .5.5V12h-6v-.5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.5H4V9.5a.5.5 0 0 1 .5-.5ZM4 14h6v.5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V14h6v3.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5V14Z" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className={ICON_CLASS} aria-hidden="true">
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h3.879a2.5 2.5 0 0 1 1.767.732L12.56 6.146A1.5 1.5 0 0 0 13.62 6.6H18.5A2.5 2.5 0 0 1 21 9.1v8.4A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z" />
    </svg>
  );
}

function EducationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className={ICON_CLASS} aria-hidden="true">
      <path d="M12 3.2 1.6 8.3 12 13.4l8.4-4.1v6.3h1.7V8.3L12 3.2Z" />
      <path d="M5.6 10.8v3.3c0 2.4 2.9 4.4 6.4 4.4s6.4-2 6.4-4.4v-3.3L12 13.9l-6.4-3.1Z" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className={ICON_CLASS} aria-hidden="true">
      <path d="M3.2 20.4 21 12 3.2 3.6l.02 6.4L15 12 3.22 14 3.2 20.4Z" />
    </svg>
  );
}

const NAV_HIGHLIGHTS = [
  { id: "experience-fit", label: "Experience", Icon: ExperienceIcon },
  { id: "projects", label: "Projects", Icon: ProjectsIcon },
  { id: "education", label: "Education", Icon: EducationIcon },
  { id: "contact", label: "Contact", Icon: ContactIcon },
];

const IG_GRADIENT = "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)";

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" fill="#3897f0" className="h-3.5 w-3.5 shrink-0" aria-label="Verified">
      <path d="m12 1.6 2.34 1.4 2.7-.4 1.35 2.36 2.36 1.35-.4 2.7 1.4 2.34-1.4 2.34.4 2.7-2.36 1.35-1.35 2.36-2.7-.4L12 22.4l-2.34-1.4-2.7.4-1.35-2.36-2.36-1.35.4-2.7L2.25 12l1.4-2.34-.4-2.7 2.36-1.35L6.96 3.25l2.7.4L12 1.6Zm3.7 7.16-4.5 4.5-2.4-2.4-1.2 1.2 3.6 3.6 5.7-5.7-1.2-1.2Z" />
    </svg>
  );
}

interface ReelWelcomeProps {
  posts: SubstackPost[];
}

export function ReelWelcome({ posts }: ReelWelcomeProps) {
  const reels = useReelsOptional();

  return (
    <div className="relative h-full [container-type:size]">
      <div className="relative z-10 flex h-full min-h-0 flex-col gap-[4cqw] px-[5cqw] pt-[8cqw] pb-[5cqw] text-white pointer-events-none">

        <div className="flex items-center gap-[4cqw] pointer-events-auto">
          <div className="shrink-0 rounded-full p-[0.8cqw]" style={{ background: IG_GRADIENT }}>
            <div className="rounded-full bg-black p-[0.8cqw]">
              <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/Profile.jpg"
                  alt="Arthur Faria"
                  width={168}
                  height={168}
                  className="h-[22cqw] w-[22cqw] rounded-full object-cover"
                />
              </Link>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-[2.5cqw]">
            {/* <div className="flex items-center gap-1.5 text-sm font-bold">
              arthurfaria
              <VerifiedBadge />
            </div> */}
            <h1 className="text-[3.8cqw] font-bold tracking-tight">Arthur Faria</h1>
            <div className="flex gap-[6cqw]">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-[0.5cqw]">
                  <span className="text-[4.6cqw] font-black">{value}</span>
                  <span className="text-[3cqw] text-white/50">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-[3.6cqw] text-white/60">🥀 Cracked Software Engineer · 🇧🇷</p>
          <p className="mt-[2cqw] max-w-[72cqw] text-[3.6cqw] leading-relaxed text-white/70">
            I&apos;m a Product Engineer (or at least this what I say to my mom and co-workers).
          </p>
        </div>

        <div className="flex items-center gap-[4cqw] pointer-events-auto">
          <Link
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[2cqw] bg-[#262629] px-[6cqw] py-[1.5cqw] text-[3cqw] font-semibold transition hover:bg-[#2f2f33]"
          >
            Following
          </Link>
          <div className="ml-auto flex items-center gap-[4cqw]">
            {SOCIAL_LINKS.map(({ label, icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="opacity-70 transition hover:opacity-100"
              >
                <Image src={icon} alt={label} width={40} height={40} className="h-[5cqw] w-[5cqw]" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex gap-[5cqw] pointer-events-auto">
          {NAV_HIGHLIGHTS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => reels?.scrollToReel(id)}
              className="flex cursor-pointer flex-col items-center gap-[1.5cqw] transition-transform active:scale-90"
            >
              <div className="rounded-full p-[0.65cqw]" style={{ background: IG_GRADIENT }}>
                <div className="flex h-[13.8cqw] w-[13.8cqw] items-center justify-center rounded-full bg-black transition hover:bg-neutral-900">
                  <Icon />
                </div>
              </div>
              <span className="text-[2.8cqw] font-medium text-white/70">{label}</span>
            </button>
          ))}
        </div>

        {posts.length > 0 && (
          <div className="welcome-post-grid pointer-events-auto grid grid-cols-3 gap-[0.5cqw] border-t border-white/10 pt-[3cqw]">
            {posts.map((post, i) => (
              <a
                key={`${post.link}-${i}`}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-[#1c1c1e]"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:opacity-80"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center p-[2cqw] text-center text-[2.6cqw] leading-tight text-white/60">
                    {post.title}
                  </span>
                )}
              </a>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

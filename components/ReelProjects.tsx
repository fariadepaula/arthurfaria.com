"use client";

const LANGUAGE_STYLES: Record<string, { dot: string; label: string }> = {
  TypeScript: { dot: "bg-blue-400", label: "text-blue-300" },
  JavaScript: { dot: "bg-yellow-400", label: "text-yellow-300" },
  Ruby: { dot: "bg-red-400", label: "text-red-300" },
  Python: { dot: "bg-green-400", label: "text-green-300" },
  Go: { dot: "bg-cyan-400", label: "text-cyan-300" },
};

export interface Project {
  name: string;
  description: string;
  language: string;
  github: string;
}

interface ReelProjectsProps {
  projects: Project[];
  title?: string;
}

export function ReelProjects({ projects, title = "Projects" }: ReelProjectsProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-5 py-8 text-white">
      <div className="flex flex-col items-center gap-1 pb-2 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30">Projects</p>
        <h2 className="text-3xl font-black tracking-tight">{title}</h2>
      </div>

      <div className="flex w-full max-w-sm min-h-0 flex-col gap-4">
        {projects.map((project) => {
          const lang = LANGUAGE_STYLES[project.language] ?? {
            dot: "bg-white/40",
            label: "text-white/50",
          };

          return (
            <a
              key={project.name}
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 overflow-hidden rounded-2xl border border-[#262626] bg-white/2 p-4 transition hover:border-white/25 hover:bg-white/5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#262626] bg-[#121212] font-mono text-xs font-bold text-white/70">
                    {project.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-mono text-sm font-semibold leading-tight text-white">
                    {project.name}
                  </span>
                </div>

                <img
                  src="/arrow-up-right.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="mt-1 shrink-0 opacity-30 invert transition group-hover:opacity-70"
                />
              </div>

              <p className="text-xs leading-snug text-white/50 line-clamp-3">
                {project.description}
              </p>

              <div className="flex items-center gap-1.5 border-t border-[#262626] pt-3">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${lang.dot}`} />
                <span className={`text-[10px] font-semibold ${lang.label}`}>
                  {project.language}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

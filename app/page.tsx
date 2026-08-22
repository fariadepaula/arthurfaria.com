export const dynamic = 'force-dynamic';

import { Sidebar } from "@/components/Sidebar";
import { ReelsFeed, ReelData } from "@/components/ReelsFeed";
import { ReelWelcome } from "@/components/ReelWelcome";
import { ReelExperience } from "@/components/ReelExperience";
import { ReelVideo } from "@/components/ReelVideo";
import { ReelContact } from "@/components/ReelContact";
import { ReelProjects } from "@/components/ReelProjects";

// Cuts fetched byte size (auto format/quality, capped width) without a visible
// quality hit on these small looping card/background videos.
function optimizeVideo(url: string): string {
  return url.replace("/video/upload/", "/video/upload/f_auto,q_auto,w_720/");
}

const BRAINROT_VIDEOS_ORIGINAL = [
  "https://res.cloudinary.com/dad5eakr9/video/upload/v1772802432/gta-01_gikuw8.mp4",
  "https://res.cloudinary.com/dad5eakr9/video/upload/v1772802423/satisfying-02_iepfgq.mp4",
  "https://res.cloudinary.com/dad5eakr9/video/upload/v1772802422/subway-surfers-01_iwqdy8.mp4",
  "https://res.cloudinary.com/dad5eakr9/video/upload/v1772802420/roblox-01_rodzx1.mp4",
  "https://res.cloudinary.com/dad5eakr9/video/upload/v1772802419/roblox-02_jggx2p.mp4",
  "https://res.cloudinary.com/dad5eakr9/video/upload/v1772802420/satisfying-03_vbyxhz.mp4",
  "https://res.cloudinary.com/dad5eakr9/video/upload/v1772802418/satisfying-01_xef1lp.mp4",
  "https://res.cloudinary.com/dad5eakr9/video/upload/v1772802417/cat_mzsna5.mp4",
].map(optimizeVideo);

function randomBrainrotVideos(count: number): string[] {
  const shuffled = [...BRAINROT_VIDEOS_ORIGINAL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function Home() {
  const [fitVideo, freelanceVideo, pingbackVideo] = randomBrainrotVideos(3);

  const reels: ReelData[] = [
    {
      id: "welcome",
      label: "Welcome",
      content: <ReelWelcome video={<ReelVideo src={optimizeVideo("https://res.cloudinary.com/dad5eakr9/video/upload/v1773440895/life_could_be_a_dream_nliziq.mp4")} />} />,
    },
    {
      id: "experience-fit",
      label: "FIT Energia",
      content: (
        <ReelExperience
          role="Product Engineer"
          company="FIT Energia (Santander Group)"
          period="Mar 2025 – Present"
          highlights={[
            "Promoted 2x in a single year",
            "Patched a critical IDOR vulnerability, preventing unauthorized modification of user financial data",
            "Increased user acquisition by 30% via a backend reward-referral system",
            "Reduced RAM usage by 70% using rate-limiting and concurrency in background jobs",
            "Built a Hotwire and Stimulus interface for visually mapping invoice fields, enabling OCR-based extraction of structured billing data",
            "Refactored legacy code into Ruby POROs, improving testability and long-term maintainability",
            "Led technical talks on OOD, Sidekiq Enterprise, and Clean Code",
          ]}
          stack={["Ruby on Rails", "Hotwire", "Erb", "Sidekiq"]}
          video={<ReelVideo src={fitVideo} eagerPreload showMuteButton={false} />}
        />
      ),
    },
    {
      id: "experience-freelance",
      label: "Freelancing",
      content: (
        <ReelExperience
          role="Fullstack Software Engineer"
          company="Freelancing"
          period="Jul 2024 – Mar 2025"
          highlights={[
            "Increased CTR by 60% on a solar energy landing page",
            "Built a real estate management platform with Next.js for centralized cataloging and automated price updates",
            "Implemented automated property sync via third-party APIs, reducing manual overhead",
          ]}
          stack={["MongoDB", "Next.js", "JavaScript", "TypeScript"]}
          video={<ReelVideo src={freelanceVideo} eagerPreload showMuteButton={false} />}
        />
      ),
    },
    {
      id: "experience-pingback",
      label: "Pingback",
      content: (
        <ReelExperience
          role="Software Engineer"
          company="Pingback"
          period="Oct 2023 – Jul 2024"
          highlights={[
            "Built an analytics engine that transformed raw newsletter metrics into actionable insights, reducing manual reporting time for creators",
            "Developed a lead-generation page with gated content delivery to drive newsletter subscription growth",
          ]}
          stack={["Node.js", "AWS"]}
          video={<ReelVideo src={pingbackVideo} eagerPreload showMuteButton={false} />}
        />
      ),
    },
    {
      id: "projects",
      label: "Projects",
      content: (
        <ReelProjects
          title="Projects"
          projects={[
            {
              name: "arthurfaria.com",
              description: "Personal portfolio built as a brainrot experience.",
              language: "TypeScript",
              github: "https://github.com/fariadepaula/arthurfaria.com",
            },
            {
              name: "lazycanvas",
              description: "Simple terminal UI for Canvas LMS.",
              language: "Go",
              github: "https://github.com/fariadepaula/lazycanvas",
            },
            {
              name: "rently",
              description: "Web system for managing car rentals.",
              language: "HTML",
              github: "https://github.com/fariadepaula/rently",
            },
          ]}
        />
      ),
    },
    {
      id: "projects-2",
      label: "Projects",
      content: (
        <ReelProjects
          title="More Projects"
          projects={[
            {
              name: "ipfas",
              description: "IP Finder as well as Server Names.",
              language: "Go",
              github: "https://github.com/fariadepaula/ipfas",
            },
            {
              name: "linkai",
              description: "Linktree clone built with Rails 8.",
              language: "Ruby",
              github: "https://github.com/fariadepaula/linkai",
            },
            {
              name: "photon-energia",
              description: "Institutional site for Photon Energia, a solar energy company.",
              language: "TypeScript",
              github: "https://github.com/fariadepaula/photon-energia",
            },
          ]}
        />
      ),
    },
    {
      id: "projects-3",
      label: "Projects",
      content: (
        <ReelProjects
          title="More Projects again"
          projects={[
            {
              name: "ruby-oop",
              description: "Educational material on OOP in Ruby — classes, modules, namespaces, and mixins.",
              language: "Ruby",
              github: "https://github.com/fariadepaula/ruby-oop",
            },
            {
              name: "smoni",
              description: "Scope monitor for bug bounty programs. Stay aware of any updates on the scopes you hunt.",
              language: "Python",
              github: "https://github.com/fariadepaula/smoni",
            },
          ]}
        />
      ),
    },
    {
      id: "education",
      label: "Education",
      description: "B.Sc. Software Engineering, The Pontifical Catholic University of Minas Gerais",
      content: (
        <ReelVideo src={optimizeVideo("https://res.cloudinary.com/dad5eakr9/video/upload/v1772802436/PUC-Minas_gp9brr.mp4")} />
      ),
    },
    {
      id: "contact",
      label: "Contact",
      content: <ReelContact />,
    },
  ];

  return (
    <ReelsFeed reels={reels} sidebar={<Sidebar key="sidebar" />} />
  );
}

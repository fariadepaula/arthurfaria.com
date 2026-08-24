"use client";

import { useRef, useState, useEffect } from "react";
import { Reel } from "./Reel";
import { ReelsContext } from "./ReelsContext";

export interface ReelData {
  id: string;
  label: string;
  content: React.ReactNode;
  description?: string;
}

interface ReelsFeedProps {
  reels: ReelData[];
  sidebar?: React.ReactNode;
  mobileNav?: React.ReactNode;
}

export function ReelsFeed({ reels, sidebar, mobileNav }: ReelsFeedProps) {
  const reelRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [activeReelId, setActiveReelId] = useState<string | null>(
    reels[0]?.id ?? null
  );
  const [muted, setMuted] = useState(true);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  // One batched request per counter type instead of one per reel — avoids a
  // burst of N concurrent fetches (one per Reel mount) queuing behind the
  // browser's per-origin connection limit.
  useEffect(() => {
    const ids = reels.map((r) => r.id).join(",");
    if (!ids) return;
    fetch(`/api/likes?ids=${ids}`)
      .then((r) => r.json())
      .then((d) => setLikeCounts(d.counts ?? {}));
    fetch(`/api/comments?ids=${ids}`)
      .then((r) => r.json())
      .then((d) => setCommentCounts(d.counts ?? {}));
  }, [reels]);

  function bumpLikeCount(reelId: string, delta: number) {
    setLikeCounts((c) => ({ ...c, [reelId]: (c[reelId] ?? 0) + delta }));
  }

  function bumpCommentCount(reelId: string, delta: number) {
    setCommentCounts((c) => ({ ...c, [reelId]: (c[reelId] ?? 0) + delta }));
  }

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    reelRefs.current.forEach((el, id) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveReelId(id);
          }
        },
        { threshold: 0.6 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [reels]);

  function scrollToReel(id: string) {
    const el = reelRefs.current.get(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function setRef(id: string) {
    return (el: HTMLDivElement | null) => {
      if (el) {
        reelRefs.current.set(id, el);
      } else {
        reelRefs.current.delete(id);
      }
    };
  }

  const activeIndex = reels.findIndex((r) => r.id === activeReelId);
  const preloadReelIds = new Set(
    [reels[activeIndex]?.id, reels[activeIndex + 1]?.id].filter(Boolean)
  );

  return (
    <ReelsContext.Provider
      value={{ activeReelId, scrollToReel, muted, setMuted, likeCounts, commentCounts, bumpLikeCount, bumpCommentCount }}
    >
      {sidebar}
      <div className="h-dvh flex flex-col md:block">
        <div className="flex-1 min-h-0 md:h-dvh overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
          {reels.map((reel) => (
            <Reel key={reel.id} ref={setRef(reel.id)} reelId={reel.id} description={reel.description} isActive={reel.id === activeReelId} shouldPreload={preloadReelIds.has(reel.id)}>
              {reel.content}
            </Reel>
          ))}
        </div>
        {mobileNav}
      </div>
    </ReelsContext.Provider>
  );
}

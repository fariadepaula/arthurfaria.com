"use client";

import { forwardRef, useState, useEffect, useRef } from "react";
import { LikeButton } from "./LikeButton";
import { CommentButton, CommentSection } from "./CommentSection";
import { ReelActiveContext } from "./ReelActiveContext";

interface ReelProps {
  children: React.ReactNode;
  description?: string;
  isActive?: boolean;
  shouldPreload?: boolean;
  reelId: string;
}

export const Reel = forwardRef<HTMLDivElement, ReelProps>(function Reel(
  { children, description, isActive = false, shouldPreload = false, reelId },
  ref
) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const fetchedCount = useRef(false);

  // Close the comment sheet once this reel is scrolled away from, so it can't
  // float over whatever reel becomes active next. Adjusting state directly
  // during render (rather than in an effect) when a prop changes, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [wasActive, setWasActive] = useState(isActive);
  if (isActive !== wasActive) {
    setWasActive(isActive);
    if (!isActive) setCommentOpen(false);
  }

  useEffect(() => {
    if (fetchedCount.current || (!isActive && !shouldPreload)) return;
    fetchedCount.current = true;
    fetch(`/api/comments/${reelId}?count=1`)
      .then((r) => r.json())
      .then((d) => setCommentCount(d.count ?? 0));
  }, [reelId, isActive, shouldPreload]);

  return (
    <ReelActiveContext.Provider value={{ isActive, shouldPreload }}>
      <div ref={ref} className="h-dvh flex justify-center snap-start">
        <div className="relative w-full md:w-auto md:aspect-[9/16] md:my-4 h-full md:h-[calc(100%-2rem)] overflow-hidden md:border border-[#222427] md:rounded-2xl bg-black shadow-[0_4px_50px_20px_rgba(0,0,80,0.1)]">
          <div className="h-full w-full">{children}</div>
          {description && (
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-linear-to-t from-black/80 to-transparent">
              <p className="text-white text-sm leading-snug">{description}</p>
            </div>
          )}
          <div className="md:hidden absolute right-3 bottom-[15%] flex flex-col items-center gap-4 z-20">
            <LikeButton reelId={reelId} />
            <CommentButton
              reelId={reelId}
              count={commentCount}
              onClick={() => setCommentOpen((o) => !o)}
            />
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center justify-end pb-[20%] pl-4 gap-4">
          <LikeButton reelId={reelId} />
          <CommentButton
            reelId={reelId}
            count={commentCount}
            onClick={() => setCommentOpen((o) => !o)}
          />
        </div>
        <CommentSection
          reelId={reelId}
          open={commentOpen}
          onClose={() => setCommentOpen(false)}
          onPosted={() => setCommentCount((c) => (c ?? 0) + 1)}
        />
      </div>
    </ReelActiveContext.Provider>
  );
});

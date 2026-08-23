"use client";

import { forwardRef, useCallback, useMemo, useState, useEffect, useRef } from "react";
import { LikeButton } from "./LikeButton";
import { CommentButton, CommentSection } from "./CommentSection";
import { ReelActiveContext } from "./ReelActiveContext";
import { ReelCommentsContext } from "./ReelCommentsContext";
import { useReelsOptional } from "./ReelsContext";
import { useLike } from "./useLike";

const DOUBLE_TAP_MS = 300;
const INTERACTIVE_SELECTOR = 'button, a, input, textarea, select, [role="button"]';

// Shows a transient overlay (heart burst, mute icon) for `duration`ms. A
// newer trigger supersedes an in-flight one instead of a stale timeout
// hiding it early.
function useFlash(duration: number) {
  const [active, setActive] = useState(false);
  const tokenRef = useRef(0);
  const trigger = useCallback(() => {
    setActive(true);
    const token = ++tokenRef.current;
    setTimeout(() => {
      if (tokenRef.current === token) setActive(false);
    }, duration);
  }, [duration]);
  return [active, trigger] as const;
}

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
  const [showDescription, setShowDescription] = useState(false);
  const [postDescription, setPostDescription] = useState<React.ReactNode | null>(null);
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const fetchedCount = useRef(false);
  const { liked, count: likeCount, toggle: toggleLike, like } = useLike(reelId);
  const reelsCtx = useReelsOptional();
  const muted = reelsCtx?.muted ?? true;
  const setMuted = reelsCtx?.setMuted ?? (() => {});
  const lastTapRef = useRef(0);
  const singleTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [heartBurst, triggerHeartBurst] = useFlash(800);
  const [muteFlash, triggerMuteFlash] = useFlash(600);

  function showHeartBurst() {
    like();
    triggerHeartBurst();
  }

  function toggleMuteWithFlash() {
    setMuted((prev) => !prev);
    triggerMuteFlash();
  }

  function handleContentClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (target.closest(INTERACTIVE_SELECTOR)) return;

    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_MS) {
      // Second tap within the window — it's a double-tap, not a mute toggle.
      lastTapRef.current = 0;
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      showHeartBurst();
    } else {
      lastTapRef.current = now;
      // Defer the mute toggle until we're sure a second tap isn't coming.
      singleTapTimerRef.current = setTimeout(() => {
        singleTapTimerRef.current = null;
        toggleMuteWithFlash();
      }, DOUBLE_TAP_MS);
    }
  }

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

  // Two entry points into the same sheet: tapping the caption shows the full
  // description with comments right below it; the comment icon shows only
  // the comments, no description, since the focus there is the comments.
  const openDescription = useCallback(() => {
    setCommentOpen(true);
    setShowDescription(true);
  }, []);
  const commentsContextValue = useMemo(
    () => ({ openComments: openDescription, setDescription: setPostDescription }),
    [openDescription]
  );

  function handleCommentIconClick() {
    if (commentOpen && !showDescription) {
      // Already open in comments-only mode — this click means "close".
      setCommentOpen(false);
    } else {
      // Closed, or open showing the description (e.g. opened via the
      // caption) — switch to comments-only rather than closing the sheet.
      setCommentOpen(true);
      setShowDescription(false);
    }
  }

  return (
    <ReelActiveContext.Provider value={{ isActive, shouldPreload }}>
      <div ref={ref} className="h-full md:h-dvh flex justify-center snap-start">
        <div className="relative w-full md:w-auto md:aspect-[9/16] md:my-4 h-full md:h-[calc(100%-2rem)] overflow-hidden md:border border-[#222427] md:rounded-2xl bg-black shadow-[0_4px_50px_20px_rgba(0,0,80,0.1)]">
          <div className="h-full w-full" onClick={handleContentClick}>
            <ReelCommentsContext.Provider value={commentsContextValue}>
              {children}
            </ReelCommentsContext.Provider>
          </div>
          {heartBurst && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <img
                src="/Unlike.svg"
                alt=""
                className="h-24 w-24 animate-[heart-burst_0.8s_ease-out_forwards] drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              />
            </div>
          )}
          {muteFlash && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/50 animate-[mute-flash_0.6s_ease-out_forwards]">
                <img
                  src={muted ? "/audio-muted.svg" : "/audio-playing.svg"}
                  alt=""
                  width={28}
                  height={28}
                  className="invert"
                />
              </div>
            </div>
          )}
          {/* Keyboard/screen-reader equivalent of the tap-to-mute gesture below */}
          <button type="button" onClick={toggleMuteWithFlash} className="sr-only">
            {muted ? "Unmute video" : "Mute video"}
          </button>
          {description && (
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-linear-to-t from-black/80 to-transparent">
              <p className="text-white text-sm leading-snug">{description}</p>
            </div>
          )}
          <div className="md:hidden absolute right-3 bottom-[15%] flex flex-col items-center gap-4 z-20">
            <LikeButton liked={liked} count={likeCount} onToggle={toggleLike} />
            <CommentButton
              reelId={reelId}
              count={commentCount}
              onClick={handleCommentIconClick}
            />
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center justify-end pb-[20%] pl-4 gap-4">
          <LikeButton liked={liked} count={likeCount} onToggle={toggleLike} />
          <CommentButton
            reelId={reelId}
            count={commentCount}
            onClick={handleCommentIconClick}
          />
        </div>
        <CommentSection
          reelId={reelId}
          open={commentOpen}
          onClose={() => setCommentOpen(false)}
          onPosted={() => setCommentCount((c) => (c ?? 0) + 1)}
          description={postDescription}
          showDescription={showDescription}
        />
      </div>
    </ReelActiveContext.Provider>
  );
});

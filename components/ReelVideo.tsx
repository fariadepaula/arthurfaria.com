"use client";

import { useEffect, useRef } from "react";
import { useReelActive, useReelShouldPreload } from "./ReelActiveContext";
import { useReelsOptional } from "./ReelsContext";

interface ReelVideoProps {
  src: string;
  className?: string;
  eagerPreload?: boolean;
}

export function ReelVideo({ src, className = "", eagerPreload = false }: ReelVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isActive = useReelActive();
  const shouldPreload = useReelShouldPreload();
  const reels = useReelsOptional();
  const muted = reels?.muted ?? true;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.muted = true;
    }
  }, [isActive]);

  // Split from the play/pause effect above so toggling the mute preference
  // just flips the property instead of re-issuing play() on every tap.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;
    video.muted = muted;
  }, [isActive, muted]);

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        src={src}
        className={`h-full w-full object-cover ${className}`}
        autoPlay
        loop
        muted
        playsInline
        preload={eagerPreload || shouldPreload ? "auto" : "none"}
      />
    </div>
  );
}

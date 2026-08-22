"use client";

import { useEffect, useRef } from "react";
import { useReelActive, useReelShouldPreload } from "./ReelActiveContext";
import { useReelsOptional } from "./ReelsContext";

interface ReelVideoProps {
  src: string;
  className?: string;
  eagerPreload?: boolean;
  showMuteButton?: boolean;
}

export function ReelVideo({ src, className = "", eagerPreload = false, showMuteButton = true }: ReelVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isActive = useReelActive();
  const shouldPreload = useReelShouldPreload();
  const reels = useReelsOptional();
  const muted = reels?.muted ?? true;
  const setMuted = reels?.setMuted ?? (() => {});

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.muted = muted;
      video.play().catch(() => {});
    } else {
      video.pause();
      video.muted = true;
    }
  }, [isActive]);

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

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
      {showMuteButton && (
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 flex items-center justify-center rounded-full bg-black/50 p-2 text-white z-10"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          <img
            src={muted ? "/audio-muted.svg" : "/audio-playing.svg"}
            alt={muted ? "Audio is muted" : "Audio is playing"}
            width={20}
            height={20}
            className="invert"
          />
        </button>
      )}
    </div>
  );
}

"use client";

import { createContext, useContext } from "react";

export interface ReelsContextValue {
  activeReelId: string | null;
  scrollToReel: (id: string) => void;
  muted: boolean;
  setMuted: (muted: boolean | ((prev: boolean) => boolean)) => void;
  likeCounts: Record<string, number>;
  commentCounts: Record<string, number>;
  bumpLikeCount: (reelId: string, delta: number) => void;
  bumpCommentCount: (reelId: string, delta: number) => void;
}

export const ReelsContext = createContext<ReelsContextValue | null>(null);

export function useReelsOptional(): ReelsContextValue | null {
  return useContext(ReelsContext);
}

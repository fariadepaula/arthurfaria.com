"use client";

import { useState, useEffect, useCallback } from "react";

export function useLike(reelId: string, onCountChange?: (delta: number) => void) {
  const storageKey = `liked_${reelId}`;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  const setLikedState = useCallback(
    (next: boolean) => {
      setLiked(next);
      onCountChange?.(next ? 1 : -1);
      if (next) localStorage.setItem(storageKey, "1");
      else localStorage.removeItem(storageKey);
      fetch(`/api/likes/${reelId}`, { method: next ? "POST" : "DELETE" });
    },
    [reelId, storageKey, onCountChange]
  );

  const toggle = useCallback(() => setLikedState(!liked), [liked, setLikedState]);
  const like = useCallback(() => {
    if (!liked) setLikedState(true);
  }, [liked, setLikedState]);

  return { liked, toggle, like };
}

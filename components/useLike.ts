"use client";

import { useState, useEffect, useCallback } from "react";

export function useLike(reelId: string) {
  const storageKey = `liked_${reelId}`;
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setLiked(localStorage.getItem(storageKey) === "1");
    fetch(`/api/likes/${reelId}`)
      .then((r) => r.json())
      .then((d) => setCount(typeof d.count === "number" ? d.count : null));
  }, [reelId, storageKey]);

  const setLikedState = useCallback(
    (next: boolean) => {
      setLiked(next);
      setCount((c) => (c === null ? null : c + (next ? 1 : -1)));
      if (next) localStorage.setItem(storageKey, "1");
      else localStorage.removeItem(storageKey);
      fetch(`/api/likes/${reelId}`, { method: next ? "POST" : "DELETE" });
    },
    [reelId, storageKey]
  );

  const toggle = useCallback(() => setLikedState(!liked), [liked, setLikedState]);
  const like = useCallback(() => {
    if (!liked) setLikedState(true);
  }, [liked, setLikedState]);

  return { liked, count, toggle, like };
}

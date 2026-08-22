"use client";

import Image from "next/image";

interface LikeButtonProps {
  liked: boolean;
  count: number | null;
  onToggle: () => void;
}

export function LikeButton({ liked, count, onToggle }: LikeButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="flex flex-col items-center gap-1 hover:scale-105"
      aria-label={liked ? "Unlike" : "Like"}
    >
      <Image
        src={liked ? "/Unlike.svg" : "/Like.svg"}
        alt={liked ? "Unlike" : "Like"}
        width={28}
        height={28}
      />
      {count !== null && (
        <span className="text-white text-xs">{count}</span>
      )}
    </button>
  );
}

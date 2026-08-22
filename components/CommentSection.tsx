"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Comment {
  id: string;
  username: string | null;
  content: string;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

// ---------------------------------------------------------------------------
// CommentSection — a bottom sheet over the reel on mobile (Instagram app),
// a fixed-height panel to the right of the reel on desktop (Instagram web).
// ---------------------------------------------------------------------------

interface CommentSectionProps {
  reelId: string;
  open: boolean;
  onClose: () => void;
  onPosted?: () => void;
}

export function CommentSection({ reelId, open, onClose, onPosted }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    fetch(`/api/comments/${reelId}`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []));
  }, [open, reelId]);

  // Close on any click outside the panel — the desktop side-panel variant has
  // no dimmed backdrop to catch that, unlike the mobile sheet's own backdrop.
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target)) return;
      if (target.closest(`[data-comment-toggle="${reelId}"]`)) return; // this reel's own toggle button
      onClose();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, onClose, reelId]);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [comments, open]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    const res = await fetch(`/api/comments/${reelId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, content }),
    });
    if (res.ok) {
      const { comment } = await res.json();
      setComments((prev) => [...prev, comment]);
      setContent("");
      onPosted?.();
    }
    setSubmitting(false);
  }

  return (
    <div
      className={`fixed inset-0 z-20 flex flex-col justify-end md:relative md:inset-auto md:my-4 md:ml-4 md:h-[calc(100%-2rem)] md:justify-stretch transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      {/* backdrop — mobile sheet only, desktop panel sits inline */}
      <div className="absolute inset-0 bg-black/50 md:hidden" onClick={onClose} />

      {/* panel */}
      <div
        ref={panelRef}
        className={`relative flex flex-col bg-[#18181b] rounded-t-3xl max-h-[75%] md:h-full md:w-90 md:max-h-none md:rounded-2xl md:border md:border-[#222427] ${!open ? "md:hidden" : ""}`}
      >
        {/* drag handle — mobile sheet only */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>

        <div className="relative flex items-center justify-center px-5 py-4 border-b border-white/10">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute left-5 text-white/70 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <span className="text-white text-base font-bold">Comments</span>
        </div>

        <div
          ref={listRef}
          onTouchMove={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 flex flex-col gap-6 min-h-0"
        >
          {comments.length === 0 && (
            <p className="text-white/30 text-xs text-center mt-4">No comments yet. Be the first!</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-white text-sm font-semibold">{c.username || "Anonymous"}</span>
                <span className="text-white/40 text-xs">{timeAgo(c.created_at)}</span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          onTouchMove={(e) => e.stopPropagation()}
          className="px-5 pt-4 flex flex-col gap-2 border-t border-white/10"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <input
            type="text"
            placeholder="Name (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[#232326] text-white text-sm placeholder-white/30 rounded-full px-4 py-2 outline-none border border-transparent focus:border-white/20"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a comment…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 bg-[#232326] text-white text-sm placeholder-white/30 rounded-full px-4 py-3 outline-none border border-transparent focus:border-white/20"
            />
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="shrink-0 text-sky-400 text-sm font-semibold px-1 disabled:opacity-30 transition-opacity"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CommentButton — just the icon + count, state lives in Reel
// ---------------------------------------------------------------------------

interface CommentButtonProps {
  reelId: string;
  count: number | null;
  onClick: () => void;
}

export function CommentButton({ reelId, count, onClick }: CommentButtonProps) {
  return (
    <button
      onClick={onClick}
      data-comment-toggle={reelId}
      className="flex flex-col items-center gap-1 hover:scale-105"
      aria-label="Comments"
    >
      <Image src="/Comment.svg" alt="Comments" width={28} height={28} />
      {count !== null && (
        <span className="text-white text-xs">{count}</span>
      )}
    </button>
  );
}

"use client";

import { createContext, useContext } from "react";

interface ReelCommentsContextValue {
  openComments: () => void;
  setDescription: (node: React.ReactNode | null) => void;
}

export const ReelCommentsContext = createContext<ReelCommentsContextValue>({
  openComments: () => {},
  setDescription: () => {},
});

export function useReelComments() {
  return useContext(ReelCommentsContext);
}

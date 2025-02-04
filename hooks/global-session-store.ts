"use client";

import { create } from "zustand";

interface SessionData {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    organizationId?: string | null;
  };
  expires?: string;
}
interface SessionState {
  session: SessionData | null;
  loading: boolean;
  fetchSession: () => Promise<void>;
}

export const useGlobalSession = create<SessionState>((set) => ({
  session: null,
  loading: true,
  fetchSession: async () => {
    set({ loading: true });
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    try {
      const res = await fetch(`${appUrl}/api/auth/session`, { credentials: "include" });
      if (!res.ok) {
        set({ session: null, loading: false });
        return;
      }
      const data: SessionData = await res.json();
      set({ session: data, loading: false });
      console.log("global-session-store-Fetched session:", data);
    } catch (e) {
      console.error("Error fetching session:", e);
      set({ session: null, loading: false });
    }
  },
}));

// The idea: we call `useGlobalSession.getState().fetchSession()` after login, etc.

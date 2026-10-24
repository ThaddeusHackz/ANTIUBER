"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import {
  readDemo,
  onDemoChange,
  signInDemo as signInDemoStore,
  signOutDemo as signOutDemoStore,
  DEMO_PROFILE,
} from "@/lib/demo-store";

export type SessionProfile = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  rating: number;
};

export type SessionMode = "supabase" | "demo";

type Ctx = {
  user: User | null;
  profile: SessionProfile | null;
  loading: boolean;
  mode: SessionMode;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  signInDemoLocal: () => void;
};

const SessionContext = createContext<Ctx>({
  user: null,
  profile: null,
  loading: true,
  mode: "demo",
  refresh: async () => {},
  signOut: async () => {},
  signInDemoLocal: () => {},
});

const demoUser = {
  id: DEMO_PROFILE.id,
  email: DEMO_PROFILE.email,
} as unknown as User;

const isNetworkError = (message?: string) =>
  Boolean(message && /fetch failed|network|failed to fetch|ETIMEDOUT|ENOTFOUND/i.test(message));

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SessionProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<SessionMode>("supabase");

  const load = useCallback(async () => {
    const demo = readDemo();

    // An explicit demo session always wins.
    if (demo.signedIn) {
      setMode("demo");
      setUser(demoUser);
      setProfile(demo.profile);
      setLoading(false);
      return;
    }

    if (!supabaseConfigured) {
      setMode("demo");
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error && isNetworkError(error.message)) {
        // Restricted-egress preview: stay usable with the local store.
        setMode("demo");
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setMode("supabase");
      setUser(data.user ?? null);

      if (data.user) {
        const { data: row } = await supabase
          .from("ride_profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        const meta = (data.user.user_metadata ?? {}) as Record<string, string>;
        setProfile(
          row
            ? (row as SessionProfile)
            : {
                id: data.user.id,
                full_name:
                  meta.full_name ?? data.user.email?.split("@")[0] ?? "Rider",
                email: data.user.email ?? "",
                phone: meta.phone ?? "",
                city: meta.city ?? "Accra, GH",
                rating: 4.92,
              }
        );
      } else {
        setProfile(null);
      }
    } catch {
      setMode("demo");
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const off = onDemoChange(() => void load());
    if (!supabaseConfigured) return off;

    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void load();
    });
    return () => {
      off();
      sub.subscription.unsubscribe();
    };
  }, [load]);

  const signOut = useCallback(async () => {
    if (readDemo().signedIn) {
      signOutDemoStore();
    }
    if (supabaseConfigured) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        // offline preview
      }
    }
    setUser(null);
    setProfile(null);
  }, []);

  const signInDemoLocal = useCallback(() => {
    signInDemoStore();
    void load();
  }, [load]);

  const value = useMemo(
    () => ({ user, profile, loading, mode, refresh: load, signOut, signInDemoLocal }),
    [user, profile, loading, mode, load, signOut, signInDemoLocal]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);

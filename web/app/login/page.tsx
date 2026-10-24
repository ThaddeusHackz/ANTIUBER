"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { useSession, SessionProvider } from "@/lib/session";
import { Mail, Phone, ChevronLeft, Sparkle } from "@/components/icons";

type Step = "identifier" | "password";

export default function LoginPage() {
  return (
    <SessionProvider>
      <LoginInner />
    </SessionProvider>
  );
}

function LoginInner() {
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [demoBusy, setDemoBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signInDemoLocal } = useSession();

  const email = identifier.includes("@")
    ? identifier.trim().toLowerCase()
    : `${identifier.replace(/\D/g, "")}@phone.antiuber.demo`;

  const submitIdentifier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Enter your email or phone number.");
      return;
    }
    setError(null);
    setStep("password");
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!supabaseConfigured) {
      setError("Authentication service is not configured.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);

    if (authError) {
      setError(
        authError.message.toLowerCase().includes("invalid")
          ? "Wrong email or password. Try again, or use demo access below."
          : authError.message
      );
      return;
    }
    router.push("/ride");
  };

  const demoLogin = async () => {
    setError(null);
    setDemoBusy(true);

    const startLocal = () => {
      signInDemoLocal();
      router.push("/ride");
    };

    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Database unreachable from this preview — use the offline rider store.
        startLocal();
        return;
      }

      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: json.email,
        password: json.password,
      });
      if (authError) {
        startLocal();
        return;
      }
      router.push("/ride");
    } catch {
      startLocal();
    } finally {
      setDemoBusy(false);
    }
  };

  return (
    <AuthShell>
      {step === "identifier" ? (
        <>
          <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.03em]">
            What&apos;s your email or phone number?
          </h1>
          <form onSubmit={submitIdentifier} className="mt-7">
            <label className="relative block">
              <span className="sr-only">Email or phone number</span>
              <input
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or phone number"
                className="field h-[52px] bg-white ring-1 ring-inset ring-line focus:ring-2 focus:ring-black"
              />
            </label>

            {error && <p className="mt-2 text-[13px] text-red-600">{error}</p>}

            <button
              type="submit"
              className="btn btn-primary mt-4 w-full"
            >
              Continue
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-hair" />
            <span className="text-[12px] uppercase tracking-wider text-subtle">or</span>
            <span className="h-px flex-1 bg-hair" />
          </div>

          <div className="space-y-2">
            <button className="btn btn-secondary w-full justify-start gap-3">
              <GoogleGlyph /> Continue with Google
            </button>
            <button className="btn btn-secondary w-full justify-start gap-3">
              <AppleGlyph /> Continue with Apple
            </button>
          </div>

          <p className="mt-6 text-[13px] text-muted">
            New to Uber?{" "}
            <Link href="/signup" className="link-underline font-medium text-black">
              Create an account
            </Link>
          </p>
        </>
      ) : (
        <>
          <button
            onClick={() => setStep("identifier")}
            className="mb-6 flex items-center gap-1.5 text-[13px] text-muted hover:text-black"
          >
            <ChevronLeft width={16} height={16} /> Back
          </button>

          <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.03em]">
            Enter your password
          </h1>
          <p className="mt-2 flex items-center gap-2 text-[14px] text-muted">
            {identifier.includes("@") ? <Mail width={16} height={16} /> : <Phone width={16} height={16} />}
            {identifier}
          </p>

          <form onSubmit={submitPassword} className="mt-6">
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="field h-[52px] bg-white ring-1 ring-inset ring-line focus:ring-2 focus:ring-black"
            />
            {error && <p className="mt-2 text-[13px] text-red-600">{error}</p>}

            <div className="mt-3 flex justify-end">
              <button type="button" className="text-[13px] text-muted hover:text-black">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={busy || !password}
              className="btn btn-primary mt-4 w-full"
            >
              {busy ? "Logging in…" : "Log in"}
            </button>
          </form>
        </>
      )}

      <div className="mt-8 rounded-lg border border-hair bg-surface p-4">
        <p className="flex items-center gap-2 text-[13px] font-semibold">
          <Sparkle width={16} height={16} /> Demo rider access
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted">
          Sign in as Ama Owusu with a seeded Accra ride history, saved places and a
          wallet — no sign-up needed.
        </p>
        <button
          onClick={demoLogin}
          disabled={demoBusy}
          className="btn btn-secondary btn-sm mt-3 w-full"
        >
          {demoBusy ? "Preparing your account…" : "Log in as demo rider"}
        </button>
      </div>
    </AuthShell>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1a6 6 0 01-5.6-4.1H3.1v2.6A10 10 0 0012 22z" />
      <path fill="#FBBC05" d="M6.4 14a6 6 0 010-3.9V7.5H3.1a10 10 0 000 9.1L6.4 14z" />
      <path fill="#EA4335" d="M12 6a5.4 5.4 0 013.8 1.5l2.8-2.8A9.6 9.6 0 0012 2a10 10 0 00-8.9 5.5L6.4 10A6 6 0 0112 6z" />
    </svg>
  );
}

function AppleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.7-1-2.7-4zM14.2 6.1c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-.9 2.8 1 .1 2-.5 2.7-1.3z" />
    </svg>
  );
}

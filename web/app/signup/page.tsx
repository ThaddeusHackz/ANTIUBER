"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { createClient } from "@/lib/supabase/client";
import { useSession, SessionProvider } from "@/lib/session";

export default function SignupPage() {
  return (
    <SessionProvider>
      <SignupInner />
    </SessionProvider>
  );
}

function SignupInner() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "+233 ",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signInDemoLocal } = useSession();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not create your account.");

      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      if (authError) throw new Error(authError.message);

      router.push("/ride");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      // Offline preview: fall back to the local rider store so the flow completes.
      if (/fetch|network|unavailable|not configured/i.test(message)) {
        signInDemoLocal();
        router.push("/ride");
        return;
      }
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.03em]">
        Create your account
      </h1>
      <p className="mt-2 text-[14px] text-muted">
        Ride, reserve and pay across Ghana with one account.
      </p>

      <form onSubmit={submit} className="mt-7 space-y-3">
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-[13px] font-medium">
            Full name
          </label>
          <input
            id="fullName"
            value={form.fullName}
            onChange={set("fullName")}
            placeholder="Ama Owusu"
            autoComplete="name"
            className="field h-[50px] bg-white ring-1 ring-inset ring-line focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            autoComplete="email"
            className="field h-[50px] bg-white ring-1 ring-inset ring-line focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-[13px] font-medium">
            Phone number
          </label>
          <input
            id="phone"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+233 24 000 0000"
            autoComplete="tel"
            className="field h-[50px] bg-white ring-1 ring-inset ring-line focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            className="field h-[50px] bg-white ring-1 ring-inset ring-line focus:ring-2 focus:ring-black"
          />
        </div>

        {error && <p className="text-[13px] text-red-600">{error}</p>}

        <button type="submit" disabled={busy} className="btn btn-primary w-full">
          {busy ? "Creating your account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-[13px] text-muted">
        Already have an account?{" "}
        <Link href="/login" className="link-underline font-medium text-black">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

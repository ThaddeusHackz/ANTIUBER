import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deployment health probe. Reports configuration presence (never values) and
 * whether both the public and service-role clients can reach Supabase from the
 * runtime that is serving traffic.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const report: Record<string, unknown> = {
    ok: false,
    runtime: "nodejs",
    region: process.env.VERCEL_REGION ?? null,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    config: {
      supabaseUrl: Boolean(url),
      anonKey: Boolean(anon),
      serviceRoleKey: Boolean(service),
    },
  };

  if (!url || !anon) {
    return NextResponse.json(
      { ...report, error: "Supabase env vars missing" },
      { status: 503 }
    );
  }

  const checks: Record<string, unknown> = {};

  try {
    const pub = createClient(url, anon, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error, count } = await pub
      .from("ride_fares")
      .select("id", { count: "exact" })
      .limit(10);

    checks.anon = error
      ? { ok: false, error: error.message }
      : { ok: true, fares: count ?? data?.length ?? 0 };
  } catch (e) {
    checks.anon = { ok: false, error: (e as Error).message };
  }

  if (service) {
    try {
      const admin = createClient(url, service, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { count, error } = await admin
        .from("ride_profiles")
        .select("id", { count: "exact", head: true });

      checks.serviceRole = error
        ? { ok: false, error: error.message }
        : { ok: true, profiles: count ?? 0 };
    } catch (e) {
      checks.serviceRole = { ok: false, error: (e as Error).message };
    }
  }

  const ok =
    (checks.anon as { ok: boolean } | undefined)?.ok === true &&
    (!service || (checks.serviceRole as { ok: boolean } | undefined)?.ok === true);

  return NextResponse.json(
    { ...report, ok, checks },
    { status: ok ? 200 : 500 }
  );
}

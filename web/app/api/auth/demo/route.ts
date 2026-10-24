import { NextResponse } from "next/server";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";
import { seedRider } from "@/lib/seed";

export const runtime = "nodejs";

const DEMO_EMAIL = "rider@antiuber.demo";
const DEMO_PASSWORD = "UberDemo2026!";
const DEMO_NAME = "Ama Owusu";

/**
 * Guarantees the demo rider exists and is fully seeded, then hands the
 * credentials to the browser so it can perform a real Supabase sign-in.
 */
export async function POST() {
  if (!adminConfigured) {
    return NextResponse.json(
      { error: "Demo access is not configured." },
      { status: 503 }
    );
  }

  const admin = createAdminClient();

  let userId: string | null = null;

  const created = await admin.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: DEMO_NAME, phone: "+233 24 555 0192" },
  });

  if (created.data?.user) {
    userId = created.data.user.id;
  } else {
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = list?.users?.find((u) => u.email === DEMO_EMAIL);
    if (!found) {
      return NextResponse.json(
        { error: created.error?.message ?? "Could not prepare the demo rider." },
        { status: 500 }
      );
    }
    userId = found.id;
  }

  try {
    await seedRider(admin, userId, {
      fullName: DEMO_NAME,
      email: DEMO_EMAIL,
      phone: "+233 24 555 0192",
    });
  } catch {
    // best effort
  }

  return NextResponse.json({
    ok: true,
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    name: DEMO_NAME,
  });
}

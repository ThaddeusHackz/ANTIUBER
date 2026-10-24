import { NextResponse } from "next/server";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";
import { seedRider } from "@/lib/seed";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!adminConfigured) {
    return NextResponse.json(
      { error: "Account service is not configured." },
      { status: 503 }
    );
  }

  let body: {
    fullName?: string;
    email?: string;
    password?: string;
    phone?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const phone = body.phone?.trim() ?? "";

  if (fullName.length < 2) {
    return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone },
  });

  if (error) {
    const exists = /already|registered|exists/i.test(error.message);
    return NextResponse.json(
      {
        error: exists
          ? "An account with this email already exists. Try logging in."
          : error.message,
      },
      { status: exists ? 409 : 400 }
    );
  }

  try {
    await seedRider(admin, data.user.id, { fullName, email, phone });
  } catch {
    // Profile seeding is best-effort; the account itself is created.
  }

  return NextResponse.json({ ok: true, userId: data.user.id });
}

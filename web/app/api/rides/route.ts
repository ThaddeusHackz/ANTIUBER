import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient, adminConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RidePayload = {
  tier?: string;
  pickup?: string;
  dropoff?: string;
  distanceKm?: number;
  durationMin?: number;
  fare?: number;
  driverName?: string;
  driverRating?: number;
  vehicle?: string;
  plate?: string;
  paymentMethod?: string;
  status?: string;
};

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as RidePayload;
  if (!body.pickup || !body.dropoff) {
    return NextResponse.json(
      { error: "Pickup and dropoff are required." },
      { status: 400 }
    );
  }

  const row = {
    user_id: user.id,
    status: body.status ?? "completed",
    tier: body.tier ?? "UberX",
    pickup: body.pickup,
    dropoff: body.dropoff,
    distance_km: body.distanceKm ?? 0,
    duration_min: Math.round(body.durationMin ?? 0),
    fare: body.fare ?? 0,
    currency: "GHS",
    driver_name: body.driverName ?? "",
    driver_rating: body.driverRating ?? 0,
    vehicle: body.vehicle ?? "",
    plate: body.plate ?? "",
    payment_method: body.paymentMethod ?? "",
    requested_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  };

  const writer = adminConfigured ? createAdminClient() : supabase;
  const { data, error } = await writer
    .from("ride_rides")
    .insert(row)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, ride: data });
}

export async function GET() {
  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ rides: [] });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ rides: [] });

  const { data } = await supabase
    .from("ride_rides")
    .select("*")
    .eq("user_id", user.id)
    .order("requested_at", { ascending: false });

  return NextResponse.json({ rides: data ?? [] });
}

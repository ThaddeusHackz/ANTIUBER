import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Seeds a new rider account with the data the authenticated experience needs:
 * profile row, saved places, a payment method and a short ride history.
 * Runs with the service-role client (server only).
 */
export async function seedRider(
  admin: SupabaseClient,
  userId: string,
  opts: { fullName: string; email: string; phone?: string }
) {
  const { data: existingProfile } = await admin
    .from("ride_profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!existingProfile) {
    await admin.from("ride_profiles").insert({
      id: userId,
      full_name: opts.fullName,
      email: opts.email,
      phone: opts.phone ?? "+233 24 000 0000",
      city: "Accra, GH",
      rating: 4.92,
    });
  }

  const { count: placeCount } = await admin
    .from("ride_places")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (!placeCount) {
    await admin.from("ride_places").insert([
      {
        user_id: userId,
        label: "Home",
        address: "12 Independence Ave, Accra",
        icon: "home",
        lat: 5.556,
        lng: -0.1969,
      },
      {
        user_id: userId,
        label: "Work",
        address: "Stanbic Heights, Airport City, Accra",
        icon: "work",
        lat: 5.6045,
        lng: -0.1725,
      },
    ]);
  }

  const { count: payCount } = await admin
    .from("ride_payment_methods")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (!payCount) {
    await admin.from("ride_payment_methods").insert([
      {
        user_id: userId,
        kind: "card",
        brand: "Visa",
        last4: "4242",
        exp: "09/29",
        is_default: true,
      },
      {
        user_id: userId,
        kind: "wallet",
        brand: "Uber Cash",
        last4: "",
        exp: "",
        is_default: false,
      },
    ]);
  }

  const { count: rideCount } = await admin
    .from("ride_rides")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (!rideCount) {
    const now = Date.now();
    const rows = [
      {
        user_id: userId,
        status: "completed",
        tier: "UberX",
        pickup: "12 Independence Ave, Accra",
        dropoff: "Kotoka International Airport",
        distance_km: 8.4,
        duration_min: 24,
        fare: 62.4,
        currency: "GHS",
        driver_name: "Kwame Mensah",
        driver_rating: 4.94,
        vehicle: "Toyota Corolla · Silver",
        plate: "GR-4821-24",
        payment_method: "Visa •••• 4242",
        rating: 5,
        requested_at: new Date(now - 86400000 * 1.2).toISOString(),
        completed_at: new Date(now - 86400000 * 1.19).toISOString(),
      },
      {
        user_id: userId,
        status: "completed",
        tier: "Comfort",
        pickup: "Stanbic Heights, Airport City",
        dropoff: "Osu Oxford Street",
        distance_km: 6.1,
        duration_min: 19,
        fare: 54.8,
        currency: "GHS",
        driver_name: "Ama Boateng",
        driver_rating: 4.98,
        vehicle: "Hyundai Elantra · Black",
        plate: "GR-9931-23",
        payment_method: "Uber Cash",
        rating: 5,
        requested_at: new Date(now - 86400000 * 4).toISOString(),
        completed_at: new Date(now - 86400000 * 4 + 1140000).toISOString(),
      },
      {
        user_id: userId,
        status: "completed",
        tier: "UberXL",
        pickup: "Accra Mall, Spintex Rd",
        dropoff: "Labadi Beach",
        distance_km: 11.7,
        duration_min: 34,
        fare: 96.3,
        currency: "GHS",
        driver_name: "Yaw Owusu",
        driver_rating: 4.91,
        vehicle: "Toyota Sienna · White",
        plate: "GE-2210-22",
        payment_method: "Visa •••• 4242",
        rating: 4,
        requested_at: new Date(now - 86400000 * 9).toISOString(),
        completed_at: new Date(now - 86400000 * 9 + 2040000).toISOString(),
      },
      {
        user_id: userId,
        status: "cancelled",
        tier: "UberX",
        pickup: "Jamestown Lighthouse",
        dropoff: "Kwame Nkrumah Circle",
        distance_km: 3.2,
        duration_min: 11,
        fare: 0,
        currency: "GHS",
        driver_name: "—",
        driver_rating: 0,
        vehicle: "—",
        plate: "—",
        payment_method: "Visa •••• 4242",
        rating: null,
        requested_at: new Date(now - 86400000 * 13).toISOString(),
        completed_at: null,
      },
    ];
    await admin.from("ride_rides").insert(rows);
  }
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteFrame } from "@/components/site-frame";
import { AccountNav } from "@/components/rider/account-nav";
import { RiderGuard } from "@/components/rider/rider-guard";
import { useSession } from "@/lib/session";
import { readDemo, updateDemoProfile } from "@/lib/demo-store";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import type { Place } from "@/lib/types";
import { Home, Briefcase, Star, Logout, Check, ChevronRight } from "@/components/icons";

export default function AccountPage() {
  return (
    <SiteFrame footer={false}>
      <AccountNav />
      <RiderGuard>
        <AccountInner />
      </RiderGuard>
    </SiteFrame>
  );
}

function AccountInner() {
  const { user, profile, refresh, signOut, mode } = useSession();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    city: profile?.city ?? "Accra, GH",
  });
  const [places, setPlaces] = useState<Place[]>([]);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name,
        phone: profile.phone,
        city: profile.city,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (mode === "demo") {
      setPlaces(readDemo().places as unknown as Place[]);
      return;
    }
    if (!supabaseConfigured || !user) return;
    const supabase = createClient();
    void (async () => {
      const { data } = await supabase
        .from("ride_places")
        .select("*")
        .eq("user_id", user.id);
      setPlaces((data as Place[]) ?? []);
    })();
  }, [user, mode]);

  const save = async () => {
    if (mode === "demo") {
      updateDemoProfile({
        full_name: form.full_name,
        phone: form.phone,
        city: form.city,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
      return;
    }
    if (!user || !supabaseConfigured) return;
    const supabase = createClient();
    await supabase
      .from("ride_profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        city: form.city,
      })
      .eq("id", user.id);
    await refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="shell max-w-[760px] py-10">
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-black text-[20px] font-semibold text-white">
          {(profile?.full_name ?? "Rider")
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em]">
            {profile?.full_name ?? "Your account"}
          </h1>
          <p className="flex items-center gap-1.5 text-[13px] text-muted">
            <Star width={13} height={13} /> {(profile?.rating ?? 4.92).toFixed(2)} rider
            rating · {profile?.city ?? "Accra, GH"}
          </p>
        </div>
      </div>

      <section className="mt-9">
        <h2 className="text-[17px] font-semibold">Personal information</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium text-muted">Full name</span>
            <input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="field"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-[13px] font-medium text-muted">Email</span>
            <input value={user?.email ?? ""} readOnly className="field opacity-70" />
          </label>
          <label>
            <span className="mb-1.5 block text-[13px] font-medium text-muted">Phone</span>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="field"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium text-muted">City</span>
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="field"
            >
              <option>Accra, GH</option>
              <option>Kumasi, GH</option>
              <option>Sekondi-Takoradi, GH</option>
              <option>Cape Coast, GH</option>
            </select>
          </label>
        </div>
        <button onClick={save} className="btn btn-primary btn-sm mt-4">
          {saved ? (
            <>
              <Check width={15} height={15} /> Saved
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </section>

      <section className="mt-10">
        <h2 className="text-[17px] font-semibold">Saved places</h2>
        <div className="mt-3 divide-y divide-hair border-y border-hair">
          {places.length === 0 && (
            <p className="py-5 text-[14px] text-muted">No saved places yet.</p>
          )}
          {places.map((p) => (
            <div key={p.id} className="flex items-center gap-3 py-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-surface">
                {p.icon === "work" ? <Briefcase width={16} height={16} /> : <Home width={16} height={16} />}
              </span>
              <div className="flex-1">
                <p className="text-[14px] font-medium">{p.label}</p>
                <p className="text-[12px] text-muted">{p.address}</p>
              </div>
              <ChevronRight width={16} height={16} className="text-subtle" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-lg bg-surface p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-semibold">Sign out of your account</p>
            <p className="mt-0.5 text-[13px] text-muted">
              You&apos;ll need to log in again to book a ride.
            </p>
          </div>
          <button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="btn btn-secondary btn-sm"
          >
            <Logout width={16} height={16} /> Sign out
          </button>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { SiteFrame } from "@/components/site-frame";
import { AccountNav } from "@/components/rider/account-nav";
import { RiderGuard } from "@/components/rider/rider-guard";
import { useSession } from "@/lib/session";
import {
  readDemo,
  addDemoPayment,
  setDemoDefaultPayment,
} from "@/lib/demo-store";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { shortGHS } from "@/lib/format";
import type { PaymentMethod } from "@/lib/types";
import { Card, Cash, Check, Plus, Shield, Wallet } from "@/components/icons";

export default function PaymentsPage() {
  return (
    <SiteFrame footer={false}>
      <AccountNav />
      <RiderGuard>
        <PaymentsInner />
      </RiderGuard>
    </SiteFrame>
  );
}

function PaymentsInner() {
  const { user, mode } = useSession();
  const [methods, setMethods] = useState<PaymentMethod[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ number: "", exp: "", cvc: "" });
  const [busy, setBusy] = useState(false);
  const cash = 42.5;

  useEffect(() => {
    if (mode === "demo") {
      setMethods(readDemo().payments);
      return;
    }
    if (!supabaseConfigured || !user) return;
    const supabase = createClient();
    void (async () => {
      const { data } = await supabase
        .from("ride_payment_methods")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");
      setMethods((data as PaymentMethod[]) ?? []);
    })();
  }, [user, mode]);

  const addCard = async () => {
    const digits = form.number.replace(/\D/g, "");
    if (digits.length < 12) return;
    setBusy(true);

    if (mode === "demo") {
      const brand = digits.startsWith("4") ? "Visa" : digits.startsWith("5") ? "Mastercard" : "Card";
      const row = addDemoPayment({
        kind: "card",
        brand,
        last4: digits.slice(-4),
        exp: form.exp || "12/29",
      });
      setMethods((m) => [...(m ?? []), row]);
      setAdding(false);
      setForm({ number: "", exp: "", cvc: "" });
      setBusy(false);
      return;
    }

    if (!user || !supabaseConfigured) return;
    const supabase = createClient();
    const brand = digits.startsWith("4") ? "Visa" : digits.startsWith("5") ? "Mastercard" : "Card";
    const { data, error } = await supabase
      .from("ride_payment_methods")
      .insert({
        user_id: user.id,
        kind: "card",
        brand,
        last4: digits.slice(-4),
        exp: form.exp || "12/29",
        is_default: false,
      })
      .select()
      .single();
    setBusy(false);
    if (!error && data) {
      setMethods((m) => [...(m ?? []), data as PaymentMethod]);
      setAdding(false);
      setForm({ number: "", exp: "", cvc: "" });
    }
  };

  const makeDefault = async (id: string) => {
    if (mode === "demo") {
      setDemoDefaultPayment(id);
      setMethods(readDemo().payments);
      return;
    }
    if (!user || !supabaseConfigured) return;
    const supabase = createClient();
    setMethods((m) => (m ?? []).map((p) => ({ ...p, is_default: p.id === id })));
    await supabase
      .from("ride_payment_methods")
      .update({ is_default: false })
      .eq("user_id", user.id);
    await supabase
      .from("ride_payment_methods")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", user.id);
  };

  return (
    <div className="shell max-w-[760px] py-10">
      <h1 className="text-[32px] font-semibold tracking-[-0.03em]">Wallet</h1>
      <p className="mt-1 text-[14px] text-muted">
        Payment methods, Uber Cash and receipts.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl2 bg-black p-6 text-white">
          <p className="text-[12px] uppercase tracking-[.12em] text-white/50">Uber Cash</p>
          <p className="mt-3 text-[30px] font-semibold tracking-[-0.03em]">
            {shortGHS(cash)}
          </p>
          <p className="mt-1 text-[13px] text-white/60">Balance available for rides</p>
          <button className="btn btn-sm mt-5 bg-white text-black hover:bg-white/90">
            Add funds
          </button>
        </div>
        <div className="rounded-xl2 border border-hair p-6">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-surface">
            <Shield width={18} height={18} />
          </span>
          <p className="mt-4 text-[15px] font-semibold">Protected payments</p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            Card details are tokenised. This demo stores only the brand and last four
            digits.
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-[19px] font-semibold tracking-[-0.02em]">Payment methods</h2>
        <button
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1.5 text-[13px] font-medium hover:underline"
        >
          <Plus width={15} height={15} /> Add payment
        </button>
      </div>

      {adding && (
        <div className="mt-4 rounded-lg border border-hair p-4 animate-fade-up">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="Card number"
              inputMode="numeric"
              className="field sm:col-span-2"
            />
            <input
              value={form.exp}
              onChange={(e) => setForm({ ...form, exp: e.target.value })}
              placeholder="MM/YY"
              className="field"
            />
            <input
              value={form.cvc}
              onChange={(e) => setForm({ ...form, cvc: e.target.value })}
              placeholder="CVC"
              className="field"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={addCard}
              disabled={busy}
              className="btn btn-primary btn-sm"
            >
              {busy ? "Adding…" : "Save card"}
            </button>
            <button onClick={() => setAdding(false)} className="btn btn-ghost btn-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 divide-y divide-hair">
        {methods === null &&
          [0, 1].map((i) => (
            <div key={i} className="h-16 animate-pulse bg-surface/70" />
          ))}

        {(methods ?? []).map((m) => (
          <button
            key={m.id}
            onClick={() => makeDefault(m.id)}
            className="flex w-full items-center gap-4 py-4 text-left"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-surface">
              {m.kind === "wallet" ? <Cash width={18} height={18} /> : <Card width={18} height={18} />}
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-medium">
                {m.kind === "wallet" ? m.brand : `${m.brand} •••• ${m.last4}`}
              </span>
              <span className="block text-[12px] text-muted">
                {m.is_default ? "Default payment method" : "Tap to make default"}
                {m.exp ? ` · Expires ${m.exp}` : ""}
              </span>
            </span>
            {m.is_default && <Check width={18} height={18} />}
          </button>
        ))}

        {methods !== null && methods.length === 0 && (
          <div className="py-10 text-center text-[14px] text-muted">
            <Wallet width={22} height={22} className="mx-auto mb-3" />
            No payment methods yet.
          </div>
        )}
      </div>

      <div className="mt-8 rounded-lg bg-surface p-5">
        <p className="text-[14px] font-semibold">Need a receipt?</p>
        <p className="mt-1 text-[13px] text-muted">
          Every completed trip has a receipt with a fare breakdown in Activity.
        </p>
        <a href="/activity" className="btn btn-secondary btn-sm mt-4 w-fit">
          View activity
        </a>
      </div>
    </div>
  );
}

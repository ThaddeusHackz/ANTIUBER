"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CityPicker } from "@/components/city-picker";
import { Clock, CircleDot, Pin, ChevronDown, Crosshair } from "@/components/icons";

export function Hero() {
  const [city, setCity] = useState("Accra");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [when, setWhen] = useState<"now" | "later">("now");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dropoff) params.set("destination", dropoff);
    if (pickup) params.set("pickup", pickup);
    if (when === "later") params.set("schedule", "1");
    router.push(`/ride${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="shell grid items-center gap-10 pb-6 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16 lg:pb-16 lg:pt-14">
        <div className="animate-fade-up">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="h-2 w-2 rounded-full bg-good" />
            <span className="font-medium">{city}, GH</span>
            <button
              onClick={() => setPickerOpen(true)}
              className="link-underline text-muted hover:text-black"
            >
              Change city
            </button>
          </div>

          <h1 className="h-display mt-3">Go anywhere</h1>

          <form onSubmit={submit} className="mt-7 w-full max-w-[480px]">
            <div className="mb-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWhen(when === "now" ? "later" : "now")}
                className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[13px] font-medium hover:bg-[#ededed]"
              >
                <Clock width={15} height={15} />
                {when === "now" ? "Pickup now" : "Schedule for later"}
                <ChevronDown width={14} height={14} />
              </button>
              {when === "later" && (
                <input
                  type="datetime-local"
                  className="rounded-full border border-line px-3 py-1.5 text-[13px]"
                  aria-label="Pickup date and time"
                />
              )}
            </div>

            <div className="relative rounded-lg bg-surface p-1.5">
              <div className="flex items-center gap-3 rounded-md px-3.5">
                <Crosshair width={18} height={18} className="text-muted" />
                <input
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Pickup location"
                  className="h-[46px] w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
                />
              </div>
              <div className="mx-3.5 flex items-center">
                <div className="h-px w-full bg-line" />
              </div>
              <div className="flex items-center gap-3 rounded-md bg-white px-3.5 shadow-[0_1px_2px_rgba(0,0,0,.08)]">
                <CircleDot width={18} height={18} className="text-muted" />
                <input
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Dropoff location"
                  className="h-[46px] w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
                />
                <Pin width={16} height={16} className="text-subtle" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button type="submit" className="btn btn-primary px-6">
                See prices
              </button>
              <a
                href="/login"
                className="text-[14px] font-medium underline decoration-[1.5px] underline-offset-4 hover:decoration-2"
              >
                Log in to check your activity
              </a>
            </div>
          </form>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] animate-fade-in">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surfaceAlt">
            <Image
              src="/images/hero-travel.jpg"
              alt="Travel collage: packing, navigation, taxis, luggage, and reunions during urban trips"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <CityPicker
        open={pickerOpen}
        city={city}
        onClose={() => setPickerOpen(false)}
        onSelect={setCity}
      />
    </section>
  );
}

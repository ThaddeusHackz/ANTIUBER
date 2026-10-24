"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CITIES } from "@/lib/content";
import { Search, Close, Pin } from "@/components/icons";

export function CityPicker({
  open,
  onClose,
  city,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  city: string;
  onSelect: (city: string) => void;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }
  }, [open, onClose]);

  const list = useMemo(
    () =>
      CITIES.filter(
        (c) =>
          !q.trim() ||
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.region.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/40 px-4 pt-[8vh] animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-xl2 bg-white shadow-menu animate-sheet-up">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Change city</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/[.06]"
          >
            <Close />
          </button>
        </div>

        <div className="px-6 pb-4 pt-4">
          <div className="flex items-center gap-3 rounded-lg bg-surface px-4 focus-within:ring-2 focus-within:ring-black">
            <Search className="text-muted" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for a city"
              className="h-12 w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
            />
          </div>
        </div>

        <div className="max-h-[46vh] overflow-y-auto px-2 pb-3">
          {list.map((c) => {
            const active = c.name === city;
            return (
              <button
                key={c.slug}
                onClick={() => {
                  onSelect(c.name);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-surface ${
                  active ? "bg-surface" : ""
                }`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-hair text-black">
                  <Pin width={17} height={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">
                    {c.name}, {c.region}
                  </span>
                  <span className="block text-[13px] text-muted">
                    {c.live ? "Available now" : "Coming soon"}
                  </span>
                </span>
                {active && (
                  <span className="rounded-full bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
          {list.length === 0 && (
            <p className="px-4 py-8 text-center text-[14px] text-muted">
              No cities match “{q}”.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

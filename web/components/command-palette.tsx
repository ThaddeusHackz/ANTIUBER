"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Car, Calendar, Receipt, Card, Shield, Briefcase, ArrowRight } from "@/components/icons";

type Action = {
  id: string;
  label: string;
  hint: string;
  href: string;
  icon: React.ReactNode;
  keywords: string;
};

const ACTIONS: Action[] = [
  { id: "ride", label: "Book a ride", hint: "Go anywhere in Accra", href: "/ride", icon: <Car width={17} height={17} />, keywords: "book ride request trip now" },
  { id: "reserve", label: "Reserve for later", hint: "Schedule up to 90 days ahead", href: "/reserve", icon: <Calendar width={17} height={17} />, keywords: "reserve schedule later airport" },
  { id: "activity", label: "Your activity", hint: "Trips and receipts", href: "/activity", icon: <Receipt width={17} height={17} />, keywords: "activity history trips receipts past" },
  { id: "payments", label: "Payment methods", hint: "Cards, Uber Cash, promos", href: "/payments", icon: <Card width={17} height={17} />, keywords: "payment card cash wallet billing" },
  { id: "account", label: "Account settings", hint: "Profile, safety, privacy", href: "/account", icon: <Shield width={17} height={17} />, keywords: "account profile settings safety privacy" },
  { id: "drive", label: "Drive and earn", hint: "See Ghana earnings", href: "/drive", icon: <ArrowRight width={17} height={17} />, keywords: "drive driver earn money signup" },
  { id: "business", label: "Uber for Business", hint: "Team travel dashboard", href: "/business", icon: <Briefcase width={17} height={17} />, keywords: "business work team company enterprise" },
  { id: "help", label: "Help and support", hint: "24/7 in-app support", href: "/help", icon: <Search width={17} height={17} />, keywords: "help support faq contact" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ACTIONS;
    return ACTIONS.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.hint.toLowerCase().includes(q) ||
        a.keywords.includes(q)
    );
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    }
    if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].href);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-black/30 hover:text-black lg:inline-flex"
        aria-label="Search and quick actions"
      >
        <Search width={14} height={14} />
        <span>Search</span>
        <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] font-medium text-subtle">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh]">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Quick actions"
            className="relative w-full max-w-[560px] overflow-hidden rounded-xl2 bg-white shadow-[0_24px_80px_rgba(0,0,0,.28)] animate-scale-in"
          >
            <div className="flex items-center gap-3 border-b border-hair px-4">
              <Search width={18} height={18} className="shrink-0 text-subtle" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Where are you going, or what do you need?"
                aria-label="Search actions"
                className="h-[54px] w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
              />
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 rounded border border-line px-1.5 py-0.5 text-[10px] font-medium text-subtle hover:text-black"
              >
                ESC
              </button>
            </div>

            <ul className="max-h-[46vh] overflow-y-auto p-2" role="listbox" aria-label="Results">
              {results.length === 0 && (
                <li className="px-3 py-8 text-center text-[14px] text-muted">
                  Nothing matched “{query}”. Try “airport” or “receipt”.
                </li>
              )}
              {results.map((a, i) => (
                <li key={a.id} role="option" aria-selected={i === active}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(a.href)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      i === active ? "bg-surface" : ""
                    }`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-black shadow-[0_0_0_1px_rgba(0,0,0,.08)]">
                      {a.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium">{a.label}</span>
                      <span className="block truncate text-[12px] text-muted">{a.hint}</span>
                    </span>
                    <kbd
                      className={`shrink-0 text-[11px] ${
                        i === active ? "text-muted" : "text-transparent"
                      }`}
                    >
                      ↵
                    </kbd>
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-hair px-4 py-2.5 text-[11px] text-subtle">
              <span>↑ ↓ to move · ↵ to open</span>
              <span>Uber Ghana</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

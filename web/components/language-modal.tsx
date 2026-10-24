"use client";

import { useEffect, useState } from "react";
import { LANGUAGES } from "@/lib/content";
import { Close, Globe, Check } from "@/components/icons";

export function LanguageModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState("en-GH");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-[480px] rounded-xl2 bg-white p-6 shadow-menu animate-sheet-up">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-semibold tracking-[-0.02em]">
              Select your preferred language
            </h2>
            <p className="mt-1 text-[14px] text-muted">
              You can change this at any time.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-black/[.06]"
          >
            <Close />
          </button>
        </div>

        <div className="mt-5 space-y-1">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setSelected(l.code);
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-surface"
            >
              <Globe className="text-muted" />
              <span className="flex-1 text-[15px]">{l.label}</span>
              {selected === l.code && <Check width={18} height={18} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

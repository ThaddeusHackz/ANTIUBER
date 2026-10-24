"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Receipt, Card, User, Help, Calendar, Car } from "@/components/icons";

const ITEMS = [
  { href: "/ride", label: "Ride", icon: Car },
  { href: "/activity", label: "Activity", icon: Receipt },
  { href: "/reserve", label: "Reserve", icon: Calendar },
  { href: "/payments", label: "Wallet", icon: Card },
  { href: "/account", label: "Account", icon: User },
  { href: "/help", label: "Help", icon: Help },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-hair bg-white">
      <div className="shell flex gap-1 overflow-x-auto no-scrollbar py-3">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                active ? "bg-black text-white" : "text-muted hover:bg-surface hover:text-black"
              }`}
            >
              <Icon width={16} height={16} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

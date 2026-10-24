import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";
import { CITIES } from "@/lib/content";
import { ArrowRight, Pin } from "@/components/icons";

export const metadata = { title: "Cities | Uber Ghana" };

export default function CitiesPage() {
  return (
    <SiteFrame>
      <div className="shell py-14">
        <p className="text-[13px] font-semibold uppercase tracking-[.12em] text-subtle">
          Cities
        </p>
        <h1 className="mt-2 text-[40px] font-semibold tracking-[-0.035em]">
          Get around Ghana
        </h1>
        <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-muted">
          Uber is available across Greater Accra, Ashanti and the Western Region.
          Choose a city to see local ride options, coverage and pricing.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/cities/${c.slug}`}
              className="group rounded-lg border border-hair p-6 transition-all hover:shadow-card"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-surface">
                <Pin width={18} height={18} />
              </span>
              <p className="mt-4 text-[19px] font-semibold tracking-[-0.01em]">
                {c.name}
              </p>
              <p className="mt-0.5 text-[13px] text-muted">{c.region}</p>
              <span className="mt-4 flex items-center gap-1.5 text-[13px] font-medium">
                {c.live ? "Getting around" : "Coming soon"}
                <ArrowRight
                  width={15}
                  height={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </SiteFrame>
  );
}

import Image from "next/image";
import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";
import { Check, Shield, Card, Clock, ArrowRight } from "@/components/icons";

export const metadata = {
  title: "Uber for Business | Uber Ghana",
};

export default function BusinessPage() {
  return (
    <SiteFrame>
      <section className="shell grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[.12em] text-subtle">
            Uber for Business
          </p>
          <h1 className="mt-3 text-[40px] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[54px]">
            Move your business forward
          </h1>
          <p className="mt-5 max-w-[480px] text-[16px] leading-relaxed text-muted">
            Give your organization more control, deeper insights and features built
            for enterprise users. Manage business travel, meal programmes and ground
            transport from one dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#start" className="btn btn-primary px-6">
              Get started
            </a>
            <a href="#contact" className="btn btn-secondary px-6">
              Contact sales
            </a>
          </div>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
          <Image
            src="/images/business.jpg"
            alt="Woman riding in an Uber car with luggage, chart, and clipboard icons below"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </section>

      <section id="travel" className="bg-surface py-16">
        <div className="shell">
          <h2 className="text-[32px] font-semibold tracking-[-0.03em]">
            One platform for every business need
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Business travel",
                body: "Set travel policies, book rides for employees and reconcile everything automatically.",
                icon: <Clock />,
              },
              {
                title: "Meal programmes",
                body: "Give teams daily allowances for meals with Uber Eats, managed centrally.",
                icon: <Card />,
              },
              {
                title: "Vouchers",
                body: "Send rides or meals to clients and customers with custom vouchers.",
                icon: <Shield />,
              },
            ].map((c) => (
              <div key={c.title} className="rounded-lg bg-white p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-surface">
                  {c.icon}
                </span>
                <p className="mt-4 text-[17px] font-semibold">{c.title}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="shell py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-xl2 border border-hair p-6">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold uppercase tracking-[.1em] text-subtle">
                Admin dashboard
              </p>
              <span className="rounded-full bg-surface px-2.5 py-1 text-[11px]">
                This month
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                ["GH₵ 18,420", "Total spend"],
                ["312", "Trips"],
                ["46", "Employees"],
                ["98%", "Policy compliance"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-lg bg-surface p-4">
                  <p className="text-[22px] font-semibold tracking-[-0.02em]">{v}</p>
                  <p className="text-[12px] text-muted">{l}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 h-24 rounded-lg bg-surface p-3">
              <svg viewBox="0 0 240 60" className="h-full w-full">
                <path
                  d="M0 48 L30 40 L60 44 L90 30 L120 34 L150 20 L180 26 L210 12 L240 16"
                  fill="none"
                  stroke="#111"
                  strokeWidth="2"
                />
                <path
                  d="M0 48 L30 40 L60 44 L90 30 L120 34 L150 20 L180 26 L210 12 L240 16 L240 60 L0 60 Z"
                  fill="#111"
                  opacity="0.06"
                />
              </svg>
            </div>
          </div>

          <div id="start">
            <h2 className="text-[32px] font-semibold tracking-[-0.03em]">
              Start using Uber for Business
            </h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              {[
                "No setup fees, pay only for the trips you take",
                "Centralised billing and automated receipts",
                "Employee travel policies and spend limits",
                "Dedicated account support",
              ].map((l) => (
                <li key={l} className="flex gap-2.5">
                  <Check width={18} height={18} className="mt-0.5 shrink-0" />
                  {l}
                </li>
              ))}
            </ul>

            <div id="contact" className="mt-8 rounded-lg bg-surface p-5">
              <p className="text-[15px] font-semibold">Talk to our team</p>
              <p className="mt-1 text-[13px] text-muted">
                Tell us about your organization and we&apos;ll set up a demo.
              </p>
              <div className="mt-4 grid gap-2">
                <input placeholder="Work email" className="field bg-white" />
                <input placeholder="Company" className="field bg-white" />
                <button type="button" className="btn btn-primary mt-1 w-full">
                  Request a demo <ArrowRight width={15} height={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="shell pb-16">
        <Link href="/ride" className="text-[14px] font-medium underline underline-offset-4">
          Back to riding with Uber
        </Link>
      </div>
    </SiteFrame>
  );
}

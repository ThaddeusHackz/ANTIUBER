import { Suspense } from "react";
import { SiteFrame } from "@/components/site-frame";
import { RideExperience } from "@/components/rider/ride-experience";

export const metadata = {
  title: "Go anywhere | Uber Ghana",
};

export default function RidePage() {
  return (
    <SiteFrame footer={false}>
      <Suspense
        fallback={
          <div className="grid min-h-[60vh] place-items-center text-[14px] text-muted">
            Loading…
          </div>
        }
      >
        <RideExperience />
      </Suspense>
    </SiteFrame>
  );
}

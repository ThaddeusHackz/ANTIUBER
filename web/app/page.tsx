import { SiteFrame } from "@/components/site-frame";
import { Hero } from "@/components/home/hero";
import {
  ReadyToTravel,
  ExploreTiles,
  HowItWorks,
  CityHub,
  MoreWays,
  EarnWithUber,
  BusinessCTA,
  AppDownload,
  TrustStrip,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <SiteFrame>
      <Hero />
      <div className="mt-10">
        <TrustStrip />
      </div>
      <ReadyToTravel />
      <ExploreTiles />
      <HowItWorks />
      <CityHub />
      <MoreWays />
      <EarnWithUber />
      <BusinessCTA />
      <AppDownload />
    </SiteFrame>
  );
}

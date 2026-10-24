import { SiteFrame } from "@/components/site-frame";
import { Hero } from "@/components/home/hero";
import { Reveal } from "@/components/ui/reveal";
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
      <Reveal>
        <div className="mt-10">
          <TrustStrip />
        </div>
      </Reveal>
      <Reveal>
        <ReadyToTravel />
      </Reveal>
      <Reveal>
        <ExploreTiles />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <CityHub />
      </Reveal>
      <Reveal>
        <MoreWays />
      </Reveal>
      <Reveal>
        <EarnWithUber />
      </Reveal>
      <Reveal>
        <BusinessCTA />
      </Reveal>
      <Reveal>
        <AppDownload />
      </Reveal>
    </SiteFrame>
  );
}

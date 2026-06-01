import HeroSection from "../components/home/HeroSection";
import FeatureCards from "../components/home/FeatureCards";
import QuickStartSection from "../components/home/QuickStartSection";
import ContinueLearning from "../components/home/ContinueLearning";
import WordOfTheDay from "../components/home/WordOfTheDay";
import SRSReviewCard from "../components/home/SRSReviewCard";
import SignupNudge from "../components/shared/SignupNudge";
import AdBanner from "../components/shared/AdBanner";

export default function Home() {
  return (
    <div>
      <SignupNudge />
      <HeroSection />
      <ContinueLearning />
      <SRSReviewCard />
      <AdBanner slot="horizontal" className="max-w-4xl mx-auto px-4" />
      <WordOfTheDay />
      <FeatureCards />
      <AdBanner slot="rectangle" className="max-w-4xl mx-auto px-4" />
      <QuickStartSection />
    </div>
  );
}
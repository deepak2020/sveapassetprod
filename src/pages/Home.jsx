import HeroSection from "../components/home/HeroSection";
import FeatureCards from "../components/home/FeatureCards";
import QuickStartSection from "../components/home/QuickStartSection";
import ContinueLearning from "../components/home/ContinueLearning";
import WordOfTheDay from "../components/home/WordOfTheDay";
import SRSReviewCard from "../components/home/SRSReviewCard";
import SignupNudge from "../components/shared/SignupNudge";
import WhatsNewDialog from "../components/home/WhatsNewDialog";

export default function Home() {
  return (
    <div>
      <WhatsNewDialog />
      <SignupNudge />
      <HeroSection />
      <ContinueLearning />
      <SRSReviewCard />
      <WordOfTheDay />
      <FeatureCards />
      <QuickStartSection />
    </div>
  );
}
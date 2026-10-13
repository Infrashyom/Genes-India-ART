
import { HeroBanner } from '../../components/home/HeroBanner';
import { FeaturesGrid } from '../../components/home/FeaturesGrid';
import { ServicesSection } from '../../components/home/ServicesSection';
import { StatsSection } from '../../components/home/StatsSection';
import { ProcessSection } from '../../components/home/ProcessSection';
import { SuccessStories } from '../../components/home/SuccessStories';
import { FaqsSection } from '../../components/home/FaqsSection';
import { LocationSection } from '../../components/home/LocationSection';

export default function PublicHome() {
  return (
    <div className="w-full bg-white selection:bg-blue-100 selection:text-blue-900">
      <HeroBanner />
      <FeaturesGrid />
      <ServicesSection />
      <StatsSection />
      <ProcessSection />
      <SuccessStories />
      <FaqsSection />
      <LocationSection />
    </div>
  );
}

import { useEffect } from 'react';
import HeroSection from '../components/landing/HeroSection';
import SearchBar from '../components/landing/SearchBar';
import FeaturedProperties from '../components/landing/FeaturedProperties';
import PopularLocations from '../components/landing/PopularLocations';
import WhyChooseUs from '../components/landing/WhyChooseUs';
import HowItWorks from '../components/landing/HowItWorks';
import StatsSection from '../components/landing/StatsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import { usePropertyStore } from '../store/propertyStore';

export default function LandingPage() {
  const { fetchFeatured } = usePropertyStore();

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <SearchBar />
      <StatsSection />
      <FeaturedProperties />
      <HowItWorks />
      <PopularLocations />
      <WhyChooseUs />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}

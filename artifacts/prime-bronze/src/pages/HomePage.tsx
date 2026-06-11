import { HeroSection } from '@/components/public/home/hero-section';
import { ServicesPreview } from '@/components/public/home/services-preview';
import { GallerySection } from '@/components/public/home/gallery-section';
import { BenefitsSection } from '@/components/public/home/benefits-section';
import { CTASection } from '@/components/public/home/cta-section';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <GallerySection />
      <BenefitsSection />
      <CTASection />
    </>
  );
}

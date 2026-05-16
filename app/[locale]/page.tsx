import HeroSection from '@/components/home/HeroSection';
import WhatWeBuild from '@/components/home/WhatWeBuild';
import dynamic from 'next/dynamic';

// Lazy load below-fold components for better initial load performance
const WhyDukan = dynamic(() => import('@/components/home/WhyDukan'), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse" />,
})

const FeaturedMachines = dynamic(() => import('@/components/home/FeaturedMachines'), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse" />,
})

const ProcessSteps = dynamic(() => import('@/components/home/ProcessSteps'), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse" />,
})

const Testimonials = dynamic(() => import('@/components/home/TestimonialsPreview'), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse" />,
})

const CTABanner = dynamic(() => import('@/components/home/CTABanner'), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse" />,
})

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500 min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <WhatWeBuild />
        <WhyDukan />
        <FeaturedMachines />
        <ProcessSteps />
        <Testimonials />
        <CTABanner />
      </main>
    </div>
  );
}
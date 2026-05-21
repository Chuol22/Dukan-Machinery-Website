'use client'

import Header from '@/components/layout/Header';
import HeroSection from '@/components/home/HeroSection';
import WhatWeBuild from '@/components/home/WhatWeBuild';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';
import dynamic from 'next/dynamic';
import Footer from '@/components/layout/Footer';

// Lazy load components
const WhyDukan = dynamic(() => import('@/components/home/WhyDukan'), {
  loading: () => <div className="h-96 bg-theme-secondary animate-pulse rounded-lg" />,
})

const FeaturedMachines = dynamic(() => import('@/components/home/FeaturedMachines'), {
  loading: () => <div className="h-96 bg-theme-secondary animate-pulse rounded-lg" />,
})

const ProcessSteps = dynamic(() => import('@/components/home/ProcessSteps'), {
  loading: () => <div className="h-96 bg-theme-secondary animate-pulse rounded-lg" />,
})

const Testimonials = dynamic(() => import('@/components/home/TestimonialsPreview'), {
  loading: () => <div className="h-96 bg-theme-secondary animate-pulse rounded-lg" />,
})

const CTABanner = dynamic(() => import('@/components/home/CTABanner'), {
  loading: () => <div className="h-96 bg-theme-secondary animate-pulse rounded-lg" />,
})

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhatWeBuild />
      <WhyDukan />
      <FeaturedMachines />
      <ProcessSteps />
      <Testimonials />
      <CTABanner />
    </>
  );
}
"use client";

// Homepage — stacks landing sections top to bottom
import HeroSection from "@/components/home/HeroSection";
import WhatWeBuild from "@/components/home/WhatWeBuild";
import dynamic from "next/dynamic";

// Below-the-fold sections lazy-load to speed up initial page load
const WhyDukan = dynamic(() => import("@/components/home/WhyDukan"), {
  loading: () => (
    <div className="h-96 bg-gray-50 dark:bg-gray-900 animate-pulse rounded-lg" />
  ),
});

const FeaturedMachines = dynamic(
  () => import("@/components/home/FeaturedMachines"),
  {
    loading: () => (
      <div className="h-96 bg-gray-50 dark:bg-gray-900 animate-pulse rounded-lg" />
    ),
  },
);

const ProcessSteps = dynamic(() => import("@/components/home/ProcessSteps"), {
  loading: () => (
    <div className="h-96 bg-gray-50 dark:bg-gray-900 animate-pulse rounded-lg" />
  ),
});

const Testimonials = dynamic(
  () => import("@/components/home/TestimonialsPreview"),
  {
    loading: () => (
      <div className="h-96 bg-gray-50 dark:bg-gray-900 animate-pulse rounded-lg" />
    ),
  },
);

const CTABanner = dynamic(() => import("@/components/home/CTABanner"), {
  loading: () => (
    <div className="h-96 bg-gray-50 dark:bg-gray-900 animate-pulse rounded-lg" />
  ),
});

export default function HomePage() {
  return (
    <>
      <HeroSection /> {/* Full-screen hero with video background */}
      <WhatWeBuild /> {/* Product category cards */}
      <WhyDukan /> {/* Company advantages + stats */}
      <FeaturedMachines /> {/* Highlighted machines grid/carousel */}
      <ProcessSteps /> {/* 4-step ordering workflow */}
      <Testimonials /> {/* Client reviews preview */}
      <CTABanner /> {/* Final contact call-to-action */}
    </>
  );
}

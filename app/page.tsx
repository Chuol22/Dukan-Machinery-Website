 
import Navbar from '@/components/layout/Header';
import HeroSection from '@/components/home/HeroSection';
import WhatWeBuild from '@/components/home/WhatWeBuild';
import WhyDukan from '@/components/home/WhyDukan';
import FeaturedMachines from '@/components/home/FeaturedMachines';
import ProcessSteps from '@/components/home/ProcessSteps';
import Testimonials from '@/components/home/TestimonialsPreview';
import CTABanner from '@/components/home/CTABanner';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';
 

export default function HomePage() {
  return (
    <div className="bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500 min-h-screen flex flex-col">
      <Navbar />
      <ChatbotWidget />
      <main className="flex-grow">
        <HeroSection />
        <WhatWeBuild />
        <WhyDukan/>
        <FeaturedMachines />
        <ProcessSteps /> 
        <Testimonials />
        <CTABanner />
      </main>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Send, Mail, Phone, MapPin, ArrowUp, MessageCircle } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-800 text-white item-center pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Main Footer Grid - 3 equal columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          
          {/* Column 1: Brand & Social */}
          <div className="space-y-3 sm:space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center">
                <Image
                  src="/images/hero/dkmlogo.png"
                  alt="Dukan Machinery Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl text-white font-black tracking-tight">
                  Dukan <span className="text-orange-500">Machinery</span>
                </h2>
                <p className="text-white/50 text-[10px] sm:text-xs">Built for Performance. Built for Reliability.</p>
              </div>
            </div>
            
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              Leading manufacturer of agricultural processing equipment in East Africa, 
              recognized for innovation, quality, and exceptional customer support.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
              <a
                href="https://facebook.com/DukanMachinery"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-600 flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-110 animate-float"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/>
                </svg>
              </a>
              <a
                href="https://t.me/DukanmachineryEt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-600 flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-110 animate-float"
                aria-label="Telegram"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@dukanmachinery"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-600 flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-110 animate-float"
                aria-label="TikTok"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/251912713823"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-600 flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-110 animate-float"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href="https://linkedin.com/company/dukan-machinery"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-600 flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-110 animate-float"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Contact Information */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-white border-l-3 border-orange-500 pl-3">
              Contact Information
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2 sm:gap-3">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 mt-0.5 flex-shrink-0 animate-float" />
                <div>
                  <p className="text-white/80">Main: +251 900 000 000</p>
                  <p className="text-white/60 text-[10px] sm:text-xs">Alt: +251 700 000 000</p>
                </div>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 mt-0.5 flex-shrink-0 animate-float" />
                <div>
                  <p className="text-white/80">info@dukanmachinery.com</p>
                  <p className="text-white/60 text-[10px] sm:text-xs">sales@dukanmachinery.com</p>
                </div>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 mt-0.5 flex-shrink-0 animate-float" />
                <div>
                  <p className="text-white/80">Selam Building, Gerji Sub City</p>
                  <p className="text-white/60 text-[10px] sm:text-xs">Addis Ababa, Ethiopia</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-white border-l-3 border-orange-500 pl-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/#what-we-build" className="text-white/60 hover:text-orange-500 transition-colors duration-300 inline-flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
                  What We Build?
                </Link>
              </li>
              <li>
                <Link href="/#process" className="text-white/60 hover:text-orange-500 transition-colors duration-300 inline-flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
                  Our Process
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-white/60 hover:text-orange-500 transition-colors duration-300 inline-flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-white/60 hover:text-orange-500 transition-colors duration-300 inline-flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
                  Insights & Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/60 hover:text-orange-500 transition-colors duration-300 inline-flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Copyright & Scroll to Top */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="text-center md:text-left">
            <p className="text-white/60 text-xs sm:text-sm">
              {currentYear} Dukan Machinery. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-orange-500 transition-colors duration-300 group"
              aria-label="Scroll to top"
            >
              <span className="text-[10px] sm:text-xs md:text-sm font-black">Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
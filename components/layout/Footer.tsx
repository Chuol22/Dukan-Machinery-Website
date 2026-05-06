'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Send, Mail, Phone, MapPin, ArrowUp, Linkedin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid - 3 equal columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Column 1: Brand & Social */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Image
                  src="/images/hero/dkmlogo.png"
                  alt="Dukan Machinery Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Dukan <span className="text-orange-500">Machinery</span>
                </h2>
                <p className="text-white/50 text-xs">Built for Performance. Built for Reliability.</p>
              </div>
            </div>
            
            <p className="text-white/60 text-sm leading-relaxed">
              Leading manufacturer of agricultural processing equipment in East Africa, 
              recognized for innovation, quality, and exceptional customer support.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com/DukanMachinery"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/>
                </svg>
              </a>
              <a
                href="https://t.me/DukanmachineryEt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-110"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@dukanmachinery"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-110"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/251912713823"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/dukan-machinery"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-l-3 border-orange-500 pl-3">
              Contact Information
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/80">Main: +251 900 000 000</p>
                  <p className="text-white/60 text-xs">Alt: +251 700 000 000</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/80">info@dukanmachinery.com</p>
                  <p className="text-white/60 text-xs">sales@dukanmachinery.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/80">Selam Building, Gerji Sub City</p>
                  <p className="text-white/60 text-xs">Addis Ababa, Ethiopia</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-l-3 border-orange-500 pl-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
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

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © {currentYear} Dukan Machinery PLC. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-xs">
            <Link href="/privacy" className="text-white/40 hover:text-orange-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-orange-500 transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-white/40 hover:text-orange-500 transition-colors">
              Sitemap
            </Link>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-white/40 hover:text-orange-500 transition-all duration-300 text-xs"
          >
            Back to Top
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
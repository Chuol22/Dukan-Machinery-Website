'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import LanguageSelector from './LanguageSelector'
import ModeToggle from './ModeToggle'
import MobileMenu from './MobileMenu'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Header() {
  const { t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: t('nav.home') || 'Home', href: '/' },
    { name: t('nav.machines') || 'Machines', href: '/machines' },
    { name: t('nav.order') || 'Order', href: '/order' },
    { name: t('nav.process') || 'Process', href: '/process' },
    { name: t('nav.testimonials') || 'Testimonials', href: '/testimonials' },
    { name: t('nav.insights') || 'Insights', href: '/insights' },
    { name: t('nav.contact') || 'Contact', href: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white dark:bg-gray-900 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800'
            : 'bg-white dark:bg-gray-900'
        }`}
      >
        <nav className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
              {/* Logo Image */}
              {!logoError ? (
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
                  <Image
                    src="/images/hero/dkmlogo.png"
                    alt="Dukan Machinery Logo"
                    fill
                    className="object-contain"
                    onError={() => setLogoError(true)}
                    priority
                  />
                </div>
              ) : (
                // Fallback: Try alternative logo path
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
                  <Image
                    src="/images/dkmlogo.png"
                    alt="Dukan Machinery Logo"
                    fill
                    className="object-contain"
                    onError={() => console.log('Logo not found')}
                    priority
                  />
                </div>
              )}
              
              {/* Company Name - Hide on very small screens, show on larger */}
              <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-black tracking-tighter text-green-700 dark:text-white uppercase whitespace-nowrap">DUKAN</span>
              <span className="text-[6px] sm:text-[7px] md:text-[8px] font-black text-orange-600 dark:text-white uppercase tracking-[0.2em] whitespace-nowrap">Machinery</span>
              <div className='hidden md:block text-orange-400 text-xs font-black rounded-full'>Agri-Industrial</div>
          </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 2xl:space-x-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname?.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-2 py-1 text-sm xl:text-base font-black transition-all duration-300 rounded-lg nav-item nav-link cursor-pointer ${
                      isActive
                        ? 'text-secondary-dark dark:text-primary-light'
                        : 'text-secondary-dark dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-green-600"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right side - Language & Mode */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
              <LanguageSelector />
              <ModeToggle />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-neutral-300" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  )
}
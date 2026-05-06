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

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Machines', href: '/machines' },
  { name: 'Order', href: '/order' },
  { name: 'Process', href: '/process' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Insights', href: '/insights' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const pathname = usePathname()

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

  // Logo paths to try (in order of preference)
  const logoPaths = [
    ' /images/hero/dkmlogo.png',
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800'
            : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              {/* Logo Image */}
              {!logoError ? (
                <div className="relative w-14 h-14 lg:w-16 lg:h-16">
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
                <div className="relative w-14 h-14 lg:w-16 lg:h-16">
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
              
              {/* Company Name */}
              <div className="flex flex-col leading-tight">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-black tracking-tighter text-primary dark:text-white uppercase whitespace-nowrap">DUKAN</span>
              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-secondary-dark dark:text-neutral-300 uppercase tracking-[0.2em] whitespace-nowrap">Machinery</span>
          </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname?.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-2 py-1 text-base font-black transition-all duration-300 rounded-lg nav-item nav-link cursor-pointer ${
                      isActive
                        ? 'text-secondary-dark dark:text-primary-light'
                        : 'text-secondary-dark dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right side - Language & Mode */}
            <div className="hidden lg:flex items-center space-x-3">
              <LanguageSelector />
              <ModeToggle />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 dark:text-neutral-300" />
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
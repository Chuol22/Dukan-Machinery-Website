'use client'

import React from 'react'
import Link from 'next/link'

import { FaCheckCircle, FaUsers, FaCalendarAlt, FaCertificate, FaHeadset, FaTruck, FaWrench, FaMicroscope, FaLeaf, FaTrophy } from 'react-icons/fa'

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500 min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-center mb-4 text-green-800 dark:text-white">
              About <span className="text-orange-600">Dukan Machinery</span>
            </h1>
            <div className="w-20 h-1 bg-orange-500 rounded-full mt-2 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Empowering Ethiopian agriculture through innovative, reliable, and sustainable machinery solutions since 2010
            </p>
          </div>

          {/* Company Overview / Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: FaCalendarAlt, label: "Years", value: "4+", color: "text-orange-500" },
              { icon: FaUsers, label: "Happy Customers", value: "100+", color: "text-green-500" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Company Story Section */}
          <div className="mb-16 scroll-mt-20" id="story">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-black mb-6 text-orange-600">Our Story</h2>
                <div className="w-16 h-1 bg-green-600 mb-6"></div>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    Founded in 2022, <span className="font-bold text-orange-600">Dukan Machinery Industry</span> began with a simple yet powerful vision: 
                    to revolutionize Ethiopian agriculture through locally manufactured, world-class machinery.
                  </p>
                  <p>
                    What started as a small workshop in Addis Ababa with just 5 dedicated engineers has grown into 
                    one of Ethiopia&apos;s leading agricultural machinery manufacturers. Our journey is driven by a deep 
                    understanding of local farming challenges and a commitment to providing practical, durable solutions.
                  </p>
                  <p>
                    Today, we operate a state-of-the-art manufacturing facility spanning over 10,000 square meters, 
                    employing over 200 skilled professionals, and serving thousands of farmers across Ethiopia and 
                    beyond. Every machine that leaves our factory carries our promise of quality, reliability, and 
                    innovation.
                  </p>
                </div>
              </div>
               
            </div>
          </div>

          {/* Mission & Vision Section */}
          <div className="mb-16 scroll-mt-20" id="mission-vision">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4  animate-bounce">🎯</div>
                <h3 className="text-2xl font-black mb-4 text-blue-700 dark:text-blue-400">Our Mission</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  To empower Ethiopian farmers and agribusinesses with high-quality, affordable, and innovative 
                  machinery solutions that increase productivity, reduce post-harvest losses, and drive sustainable 
                  agricultural growth across Africa.
                </p>
              </div>
              <div className="bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4 animate-float">👁️</div>
                <h3 className="text-2xl font-black mb-4 text-orange-700 dark:text-orange-400">Our Vision</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  To become Africa&apos;s most trusted agricultural machinery manufacturer, recognized globally for 
                  innovation, quality, and commitment to transforming small-scale and commercial farming through 
                  technology.
                </p>
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-4 text-green-800 dark:text-white">Our Core Values</h2>
              <div className="w-20 h-1 bg-orange-600 rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">The principles that guide everything we do</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: FaCheckCircle, title: "Quality First", desc: "Uncompromising standards in every machine we build", color: "text-green-500" },
                { icon: FaLeaf, title: "Sustainability", desc: "Eco-friendly solutions for responsible farming", color: "text-green-600" },
                { icon: FaUsers, title: "Customer Focus", desc: "Your success is our success", color: "text-blue-500" },
                { icon: FaMicroscope, title: "Innovation", desc: "Continuous improvement and R&D investment", color: "text-purple-500" }
              ].map((value, idx) => (
                <div key={idx} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300">
                  <value.icon className={`w-12 h-12 mx-auto mb-4 ${value.color}`} />
                  <h3 className="font-black mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Manufacturing Philosophy / Process Section */}
          <div className="mb-16 scroll-mt-20" id="philosophy">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black mb-4 text-orange-600">Our Manufacturing Philosophy</h2>
                <div className="w-20 h-1 bg-green-600 rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">How we build quality into every machine</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { step: "01", title: "Premium Materials", desc: "We source only the highest quality steel, motors, and components from trusted suppliers", icon: "🔧" },
                  { step: "02", title: "Precision Engineering", desc: "Advanced CNC machinery and skilled technicians ensure exact specifications", icon: "⚙️" },
                  { step: "03", title: "Rigorous Testing", desc: "Every machine undergoes comprehensive quality control before leaving our facility", icon: "✅" }
                ].map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-5xl mb-3 animate-float">{step.icon}</div>
                    <div className="text-4xl font-black text-orange-500 mb-2">{step.step}</div>
                    <h3 className="text-xl font-black mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Our Products/Services Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-4 text-green-800 dark:text-white">What We Manufacture</h2>
              <div className="w-20 h-1 bg-orange-600 rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Comprehensive machinery for all agricultural needs</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Feed Processing", items: "Grinders, Mixers, Pellet Mills", icon: "🌾" },
                { name: "Grain Handling", items: "Cleaners, Conveyors, Elevators", icon: "🌽" },
                { name: "Oil Processing", items: "Expellers, Filters, Refiners", icon: "🥜" },
                { name: "Spare Parts", items: "All replacement components", icon: "🔩" }
              ].map((product, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="text-4xl mb-3 animate-bounce">{product.icon}</div>
                  <h3 className="font-black text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.items}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="mb-16">
            <div className="bg-orange-500  rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-2">Why Choose Dukan Machinery?</h2>
                <div className="w-20 h-1 bg-white rounded-full mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: FaCertificate, title: "12-Month Warranty", desc: "Comprehensive coverage on all machines" },
                  { icon: FaHeadset, title: "24/7 Support", desc: "Round-the-clock technical assistance" },
                  { icon: FaTruck, title: "Free Delivery", desc: "Within Addis Ababa & surrounding areas" },
                  { icon: FaWrench, title: "On-site Installation", desc: "Professional setup & training included" },
                  { icon: FaUsers, title: "Expert Team", desc: "10+ skilled professionals" },
                  { icon: FaTrophy, title: "Proven Track Record", desc: "100+ satisfied customers" }
                ].map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <reason.icon className="w-6 h-6 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-black text-sm">{reason.title}</h3>
                      <p className="text-xs opacity-90">{reason.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications & Quality Standards */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-4 text-green-800 dark:text-white">Certifications & Quality Standards</h2>
              <div className="w-20 h-1 bg-orange-500 rounded-full mx-auto"></div>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { name: "ISO 9001:2015", desc: "Quality Management", icon: "📜" },
                { name: "Ethiopian Standards", desc: "ESA Certified", icon: "🇪🇹" },
                { name: "Safety Compliant", desc: "CE Certified Components", icon: "🛡️" }
              ].map((cert, idx) => (
                <div key={idx} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl min-w-45">
                  <div className="text-4xl mb-2">{cert.icon}</div>
                  <div className="font-black text-sm">{cert.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{cert.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Team Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-4 text-green-800 dark:text-white">Meet Our Leadership</h2>
              <div className="w-20 h-1 bg-orange-500 rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Dedicated professionals driving agricultural innovation</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: " Geletu", role: "Founder & CEO", exp: "7+ years in agricultural engineering"},
                { name: "Chala Alemu", role: "Head of Manufacturing", exp: "5+ years production management" },
                { name: "Dawit Kebede", role: "Technical Director", exp: "Expert in feed processing technology"}
              ].map((leader, idx) => (
                <div key={idx} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300">
                  <h3 className="font-black text-lg">{leader.name}</h3>
                  <p className="text-orange-600 text-sm font-semibold mb-2">{leader.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{leader.exp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Impact / CSR Section */}
          <div className="mb-16">
            <div className="bg-green-50 dark:bg-gray-800 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-4 text-green-800 dark:text-white">Our Impact on Ethiopian Agriculture</h2>
                <div className="w-20 h-1 bg-orange-500 rounded-full mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-black mb-4 text-orange-600">Economic Impact</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">✓ 100+ farmers empowered with machinery</li>
                    <li className="flex items-center gap-2">✓ 30% average increase in farm productivity</li>
                    <li className="flex items-center gap-2">✓ 200+ local jobs created</li>
                    <li className="flex items-center gap-2">✓ 50+ trained technicians across Ethiopia</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-black mb-4 text-orange-600">Community Initiatives</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">✓ Free training workshops for small-scale farmers</li>
                    <li className="flex items-center gap-2">✓ Youth apprenticeship programs</li>
                    <li className="flex items-center gap-2">✓ Women in agriculture scholarship fund</li>
                    <li className="flex items-center gap-2">✓ Machinery donation to farming cooperatives</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-black mb-4">Ready to Transform Your Farming Operation?</h2>
            <p className="mb-6 text-lg opacity-95">Join thousands of satisfied farmers who trust Dukan Machinery</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/contact" className="bg-white text-orange-600 font-black px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 inline-block">
                Contact Us Today
              </a>
              <Link href="/machines" className="border-2 border-white text-white font-black px-8 py-3 rounded-full hover:bg-white hover:text-orange-600 transition-all duration-300 hover:scale-105 inline-block">
                Explore Machines
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
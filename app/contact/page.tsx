"use client";

// Contact page — FAQ accordions, contact channels, and social links
import React, { useState } from "react";
import { FaWhatsapp, FaTelegram, FaTiktok } from "react-icons/fa";

export default function ContactPage() {
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({});

  // Toggle individual FAQ item open/closed
  const toggleFaq = (category: string | number, index: number) => {
    const key = `${category}-${index}`;
    setOpenFaqs((prev: Record<string, boolean>) => ({ ...prev, [key]: !prev[key] }));
  };

  // FAQ content grouped by topic
  const faqCategories = [
    {
      title: "General Questions",
      icon: "❓",
      questions: [
        { q: "What types of machines do you manufacture?", a: "We manufacture a wide range of agricultural machinery including feed processing machines, grinding mills, mixers, pellet machines, and complete feed production lines for various farm sizes and requirements." },
        { q: "What capacity do I need for my farm?", a: "Capacity depends on your farm size and production needs. We offer machines from 500kg to 10,000kg per hour. Contact our sales team for a personalized recommendation based on your specific requirements." },
        { q: "Do you offer machines for different types of feed?", a: "Yes, we manufacture machines for poultry feed, cattle feed, fish feed, livestock feed, and specialized animal nutrition products. Each machine can be customized for your specific feed type." }
      ]
    },
    {
      title: "Orders & Customization",
      icon: "📦",
      questions: [
        { q: "Can I customize machines to my specific requirements?", a: "Absolutely! We offer full customization options including capacity adjustments, material specifications, motor types, and additional features to match your exact production needs." },
        { q: "How do I place an order?", a: "You can place an order by contacting our sales team via phone, email, WhatsApp, or by visiting our showroom. We'll guide you through the selection, quotation, and ordering process." },
        { q: "What is your typical production lead time?", a: "Standard machines are typically ready in 15-30 days. Custom orders may take 30-45 days depending on complexity. We'll provide exact timelines during the ordering process." }
      ]
    },
    {
      title: "Installation & Support",
      icon: "🔧",
      questions: [
        { q: "Do you install machines on site?", a: "Yes, we provide professional on-site installation services across Ethiopia. Our technical team will ensure proper setup, calibration, and test running of your machine." },
        { q: "Do you provide training for machine operation?", a: "Yes, comprehensive training is included with every machine purchase. We train your operators on proper usage, maintenance, safety procedures, and troubleshooting." },
        { q: "What happens if my machine breaks down?", a: "We offer 24/7 technical support. Our service team can guide you through troubleshooting remotely or dispatch a technician to your location for major repairs." }
      ]
    },
    {
      title: "Warranty & Maintenance",
      icon: "🛡️",
      questions: [
        { q: "What are your warranty details?", a: "All machines come with a 12-month warranty covering manufacturing defects and premature component failure. Extended warranty options are available for purchase." },
        { q: "What maintenance is required?", a: "Regular maintenance includes daily cleaning, weekly lubrication, monthly belt tension checks, and quarterly professional inspection. We provide detailed maintenance manuals." },
        { q: "Do you sell spare parts?", a: "Yes, we maintain a comprehensive inventory of genuine spare parts for all our machines. Parts can be ordered online, by phone, or at our physical location." }
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500 min-h-screen flex flex-col">
      <main className="grow container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black text-center mb-8 text-green-800 dark:text-white">
            Contact <span className="text-orange-600">US</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Contact Form Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-black mb-6 text-secondary-dark">Send Us Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-black mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="My name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="dukanm@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+251 (90) 000-000"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a subject</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="parts">Parts & Accessories</option>
                    <option value="service">Service Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-8">
              <div className="bg-green-50 dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-black mb-6 text-secondary-dark dark:text-white">Contact Information</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="shrink-0 w-10 h-10 bg-primary text-gray-200 rounded-full flex items-center justify-center">
                      📍
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        SELAM BUILDING<br />
                        Kality<br />
                        Addis Ababa, Ethiopia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                      📞
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        <a
                          href="tel:+251912713823"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                          <span>+251 912 713 823</span>
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="shrink-0 w-10 h-10 bg-orange-300 text-gray-200 rounded-full flex items-center justify-center">
                      ✉️
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        <a
                          href="mailto:geletupro@gmail.com"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" />
                          <span>geletupro@gmail.com</span>
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 sm:col-span-2">
                    <div className="shrink-0 w-10 h-10 bg-orange-300 text-orange-600 rounded-full flex items-center justify-center">
                      💬
                    </div>
                    <div className="w-full">
                      <h3 className="font-semibold mb-3">Follow Us</h3>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href="https://wa.me/251912713823"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600 hover:bg-green-300 hover:scale-110 transition-all duration-300 animate-bounce"
                          aria-label="WhatsApp"
                        >
                          <FaWhatsapp className="w-6 h-6" />
                        </a>
                        <a
                          href="https://t.me/DukanmachineryEt"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-300 hover:scale-110 transition-all duration-300 animate-bounce"
                          aria-label="Telegram"
                        >
                          <FaTelegram className="w-6 h-6" />
                        </a>
                        <a
                          href="https://www.tiktok.com/@yourusername"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-black hover:bg-gray-600 hover:scale-110 transition-all duration-300 animate-bounce"
                          aria-label="TikTok"
                        >
                          <FaTiktok className="w-6 h-6" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-black mb-6 text-secondary-dark dark:text-white">Google Map</h2>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <iframe
                    title="Dukan Machinery location"
                    src="https://www.google.com/maps?q=Kality,+Addis+Ababa,+Ethiopia&output=embed"
                    className="w-full h-72 sm:h-80"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-black mb-6 text-orange-600">Business Hours</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Monday - Friday</span>
                    <span className="font-semibold dark:text-white">8:30 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Saturday</span>
                    <span className="font-semibold dark:text-white">9:00 AM - 12:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Sunday</span>
                    <span className="font-semibold dark:text-white">Closed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Emergency Support</span>
                    <span className="font-semibold text-primary">24/7 Available</span>
                  </div>
                </div>
              </div>

              {/* Emergency Support */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-black mb-3 text-secondary-dark dark:text-white">Need Immediate Assistance?</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Our technical support team is available 24/7 for emergency service requests.
                </p>
                <button
                  className="bg-orange-500 text-white font-black py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors"
                  onClick={() => {
                    window.location.href = 'tel:+251912713823';
                  }}
                >
                  Call Emergency Support
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="py-12">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-7xl text-secondary animate-bounce">❓</span>
              </div>
              <h2 className="text-4xl font-black text-primary dark:text-white uppercase tracking-tight">
                Frequently Asked <span className="text-secondary">Questions</span>
              </h2>
              <div className="w-20 h-1.5 bg-secondary mx-auto mt-4 rounded-full"></div>
              <p className="mt-6 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Find answers to common questions about our machines, orders, installation, and support.
              </p>
            </div>

            <div className="space-y-8">
              {faqCategories.map((category, catIndex) => (
                <div key={catIndex} className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="bg-primary text-white px-8 py-4 flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-xl font-black">{category.title}</h3>
                  </div>
                  <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {category.questions.map((faq, qIndex) => {
                      const faqKey = `${catIndex}-${qIndex}`;
                      const isOpen = openFaqs[faqKey];
                      return (
                        <div key={qIndex} className="p-6">
                          <button
                            onClick={() => toggleFaq(catIndex, qIndex)}
                            className="w-full flex items-center justify-between text-left focus:outline-none group"
                          >
                            <h4 className="font-black text-primary dark:text-white text-lg pr-8 group-hover:text-secondary transition-colors">
                              {faq.q}
                            </h4>
                            <span className={`text-secondary text-xl shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} group-hover:scale-110`}>
                              ▼
                            </span>
                          </button>
                          {isOpen && (
                            <div className="mt-4 text-neutral-600 dark:text-neutral-400 pl-4 border-l-4 border-primary">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Still Have Questions CTA */}
            <div className="mt-12 text-center">
              <div className="bg-primary/5 dark:bg-neutral-700 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-black text-primary dark:text-white mb-4">
                  Still Have Questions?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Can&apos;t find the answer you&apos;re looking for? Please reach out to our team.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href="https://wa.me/251912713823"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 text-white font-black px-6 py-3 rounded-full text-sm uppercase tracking-widest hover:bg-green-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    WhatsApp Us
                  </a>
                  <a
                    href="https://t.me/DukanmachineryEt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-500 text-white font-black px-6 py-3 rounded-full text-sm uppercase tracking-widest hover:bg-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <FaTelegram className="w-5 h-5" />
                    Telegram
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
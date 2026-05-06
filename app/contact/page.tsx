import Header from '@/components/layout/Header';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';

export default function ContactPage() {
  return (
    <div className="bg-gray-200 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 transition-colors duration-500 min-h-screen flex flex-col">
      <Header />
      <ChatbotWidget />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-primary">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-primary">Get in Touch</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
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
            
            <div className="space-y-8">
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-primary">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                      📍
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        123 Industrial Park Drive<br />
                        Manufacturing District<br />
                        City, State 12345
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                      📞
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Main: +1 (555) 123-4567<br />
                        Support: +1 (555) 123-4568
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                      ✉️
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Sales: sales@dukanmachinery.com<br />
                        Support: support@dukanmachinery.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-primary">Business Hours</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Monday - Friday</span>
                    <span className="font-semibold">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Saturday</span>
                    <span className="font-semibold">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Emergency Support</span>
                    <span className="font-semibold text-primary">24/7 Available</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-3">Need Immediate Assistance?</h3>
                <p className="mb-4">
                  Our technical support team is available 24/7 for emergency service requests.
                </p>
                <button className="bg-white text-primary font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                  Call Emergency Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

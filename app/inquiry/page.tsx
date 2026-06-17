import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";
import { MessageSquare, Clock, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - Ask Questions | Dukan Machinery",
  description: "Get expert advice about our agricultural and industrial machinery. Ask questions about specifications, pricing, and suitability for your needs.",
};

export default function InquiryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-950/30 rounded-full">
              <MessageSquare className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Ask Our Experts
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get personalized advice about our agricultural and industrial machinery. 
            Our experts will help you find the perfect solution for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Send Us Your Question
              </h2>
              <InquiryForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How It Works */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-950/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Submit Your Question
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Fill out the form with your details and specific requirements
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-950/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Expert Review
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Our technical specialists review your inquiry
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Personalized Response
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Receive detailed answers within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border border-green-200 dark:border-green-900/30 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-bold text-green-900 dark:text-green-100">
                  Quick Response
                </h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                We typically respond to inquiries within 24 hours during business days.
              </p>
              <div className="text-xs text-green-600 dark:text-green-400">
                <p><strong>Business Hours:</strong></p>
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 4:00 PM</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Direct Contact
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Email</p>
                  <a 
                    href="mailto:geletupro@gmail.com" 
                    className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    geletupro@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Phone</p>
                  <a 
                    href="tel:+251912713823" 
                    className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    +251 912 713 823
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Location</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
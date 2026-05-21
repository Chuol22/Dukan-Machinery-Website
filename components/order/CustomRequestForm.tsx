// components/order/CustomRequestForm.tsx
'use client'

import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  TrendingUp, 
  Zap, 
  Ruler, 
  FileText, 
  Send,
  CheckCircle,
  AlertCircle,
  Upload,
  Users,
  Clock
} from 'lucide-react'
import ImageUploader from './ImageUploader'

interface CustomRequestFormProps {
  onSubmit?: (data: CustomRequestData) => void
}

export interface CustomRequestData {
  feedType: string
  requiredCapacity: {
    value: number
    unit: 'kg/day' | 'tons/day' | 'quintals/day'
  }
  powerSource: 'electric' | 'diesel' | 'both'
  spaceAvailable: {
    length: number
    width: number
    height: number
  }
  specialRequirements: string
  referenceImages: File[]
  timeline: 'urgent' | 'standard' | 'flexible'
  budget: string
  additionalInfo: string
  contactInfo: {
    name: string
    company: string
    email: string
    phone: string
  }
}

export default function CustomRequestForm({ onSubmit }: CustomRequestFormProps) {
  const [formData, setFormData] = useState<CustomRequestData>({
    feedType: '',
    requiredCapacity: { value: 10, unit: 'tons/day' },
    powerSource: 'electric',
    spaceAvailable: { length: 5, width: 5, height: 3 },
    specialRequirements: '',
    referenceImages: [],
    timeline: 'standard',
    budget: '',
    additionalInfo: '',
    contactInfo: {
      name: '',
      company: '',
      email: '',
      phone: '',
    },
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const feedTypes = [
    'Poultry Feed (Broiler)',
    'Poultry Feed (Layer)',
    'Cattle Feed',
    'Swine Feed',
    'Aqua Feed',
    'Pet Food',
    'Other',
  ]

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.feedType) newErrors.feedType = 'Please select feed type'
    if (!formData.contactInfo.name) newErrors.name = 'Name is required'
    if (!formData.contactInfo.company) newErrors.company = 'Company name is required'
    if (!formData.contactInfo.email) newErrors.email = 'Email is required'
    if (!/\S+@\S+\.\S+/.test(formData.contactInfo.email)) newErrors.email = 'Email is invalid'
    if (!formData.contactInfo.phone) newErrors.phone = 'Phone number is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const submissionData = {
        ...formData,
        requestId: Date.now(),
        status: 'pending'
      }
      console.log('Custom request submitted:', submissionData)
      setIsSubmitting(false)
      setIsSubmitted(true)
      onSubmit?.(submissionData)
      
      // Save to localStorage
      const requests = JSON.parse(localStorage.getItem('customRequests') || '[]')
      requests.push({ ...submissionData, date: new Date().toISOString() })
      localStorage.setItem('customRequests', JSON.stringify(requests))
    }, 2000)
  }

  const handleImageUpload = (files: File[]) => {
    setFormData(prev => ({ ...prev, referenceImages: files }))
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Request Sent Successfully!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for your custom machinery request. Our engineering team will review your requirements and contact you within 48 hours.
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Request ID: <span className="font-mono font-semibold">CUST-{Date.now()}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            We've sent a confirmation to {formData.contactInfo.email}
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
        >
          Return to Home
        </button>
      </motion.div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
      <h3 className="text-2xl font-black text-primary dark:text-white mb-6 text-center">
        Custom Request
      </h3>
      
      <div className="space-y-5">
        <div className="space-y-8">
          {/* Feed Type */}
          <div>
              <label 
                htmlFor="feed-type-select"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Type of Feed to Process *
              </label>
              <select
                id="feed-type-select"
                value={formData.feedType}
                onChange={(e) => setFormData(prev => ({ ...prev, feedType: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select feed type...</option>
                {feedTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.feedType && <p className="mt-1 text-sm text-red-500">{errors.feedType}</p>}
          </div>

          {/* Capacity */}
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Required Capacity *
              </label>
            <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor="capacity-value-input" className="sr-only">Capacity value</label>
                  <input
                    id="capacity-value-input"
                    type="number"
                    value={formData.requiredCapacity.value}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      requiredCapacity: { ...prev.requiredCapacity, value: parseFloat(e.target.value) }
                    }))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                    step="0.1"
                  />
                </div>
                <div className="w-40">
                  <label htmlFor="capacity-unit-select" className="sr-only">Capacity unit</label>
                  <select
                    id="capacity-unit-select"
                    value={formData.requiredCapacity.unit}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      requiredCapacity: { ...prev.requiredCapacity, unit: e.target.value as any }
                    }))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="kg/day">kg/day</option>
                    <option value="quintals/day">quintals/day</option>
                    <option value="tons/day">tons/day</option>
                  </select>
                </div>
            </div>
          </div>

          {/* Power Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Power Source Preference
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'electric', label: 'Electric', icon: Zap },
                { value: 'diesel', label: 'Diesel', icon: Settings },
                { value: 'both', label: 'Both', icon: Zap },
              ].map((source) => (
                <button
                  key={source.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, powerSource: source.value as any }))}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    formData.powerSource === source.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  <source.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-sm font-medium">{source.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Space Available */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Available Space (meters)
            </label>
            <div className="grid grid-cols-3 gap-3">
             <div>
              <label htmlFor="space-length" className="text-xs text-gray-500">Length</label>
              <input
                id="space-length"
                type="number"
                value={formData.spaceAvailable.length}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  spaceAvailable: { ...prev.spaceAvailable, length: parseFloat(e.target.value) }
                }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.5"
              />
            </div>
            <div>
              <label htmlFor="space-width" className="text-xs text-gray-500">Width</label>
              <input
                id="space-width"
                type="number"
                value={formData.spaceAvailable.width}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  spaceAvailable: { ...prev.spaceAvailable, width: parseFloat(e.target.value) }
                }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.5"
              />
            </div>
            <div>
              <label htmlFor="space-height" className="text-xs text-gray-500">Height</label>
              <input
                id="space-height"
                type="number"
                value={formData.spaceAvailable.height}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  spaceAvailable: { ...prev.spaceAvailable, height: parseFloat(e.target.value) }
                }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.5"
              />
            </div>

            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Project Timeline
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'urgent', label: 'Urgent', icon: Clock, desc: '< 4 weeks' },
                { value: 'standard', label: 'Standard', icon: Clock, desc: '4-8 weeks' },
                { value: 'flexible', label: 'Flexible', icon: Users, desc: '> 8 weeks' },
              ].map((timeline) => (
                <button
                  key={timeline.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, timeline: timeline.value as any }))}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    formData.timeline === timeline.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  <timeline.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-sm font-medium">{timeline.label}</p>
                  <p className="text-xs text-gray-500">{timeline.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <label 
              htmlFor="budget-range-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Estimated Budget (USD)
            </label>
            <select
              id="budget-range-select"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select budget range...</option>
              <option value="10k-50k">$10,000 - $50,000</option>
              <option value="50k-100k">$50,000 - $100,000</option>
              <option value="100k-250k">$100,000 - $250,000</option>
              <option value="250k-500k">$250,000 - $500,000</option>
              <option value="500k+">$500,000+</option>
            </select>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Special Requirements
            </label>
            <textarea
              value={formData.specialRequirements}
              onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Any specific features, materials, or requirements..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reference Images / Sketches
            </label>
            <ImageUploader onImagesUploaded={handleImageUpload} maxImages={5} />
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Information
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Any other information you'd like to share..."
            />
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.contactInfo.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, name: e.target.value }
                  }))}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  id="contact-company"
                  type="text"
                  value={formData.contactInfo.company}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, company: e.target.value }
                  }))}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, email: e.target.value }
                  }))}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone *
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={formData.contactInfo.phone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, phone: e.target.value }
                  }))}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting Request...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Custom Request
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-500">
          Our team will respond within 48 hours. All information is kept confidential.
        </p>
      </div>
    </div>
  )
}
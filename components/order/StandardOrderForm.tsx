'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  Building2,
  Calendar,
  Truck,
  CreditCard,
  FileText,
  CheckCircle,
  Send,
} from 'lucide-react'
import Image from 'next/image'
import { machinesData } from '../../data/machinesData'

interface StandardOrderFormProps {
  onSubmit?: (data: StandardOrderData) => void
  preselectedMachineId?: string
}

export interface StandardOrderData {
  machineId: string
  machineName?: string
  unitPrice?: number
  totalPrice?: number
  quantity: number
  customerInfo: {
    fullName: string
    companyName: string
    email: string
    phone: string
    address: string
    city: string
  }
  deliveryInfo: {
    preferredDate: string
    deliveryAddress: string
    specialInstructions: string
  }
  paymentMethod: 'bank_transfer' | 'letter_of_credit' | 'credit_card'
  termsAccepted: boolean
}

// Helper component for safe image rendering
function SafeMachineImage({ src, alt, machineName }: { src?: string; alt: string; machineName: string }) {
  const [imgError, setImgError] = useState(false)
  
  // If no src or image failed to load, show placeholder
  if (!src || imgError) {
    return (
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <Package className="w-8 h-8 text-gray-400" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="96px"
      onError={() => setImgError(true)}
    />
  )
}

export default function StandardOrderForm({ onSubmit, preselectedMachineId }: StandardOrderFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<StandardOrderData>({
    machineId: preselectedMachineId || '',
    quantity: 1,
    customerInfo: {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
    },
    deliveryInfo: {
      preferredDate: '',
      deliveryAddress: '',
      specialInstructions: '',
    },
    paymentMethod: 'bank_transfer',
    termsAccepted: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const selectedMachine = machinesData.find(m => m.id === Number(formData.machineId))

  const priceToNumber = (price: unknown): number => {
    if (typeof price === 'number') return price
    if (!price) return 0
    const str = String(price)

    const rangeMatch = str.match(/([0-9][0-9,\.]*)\s*-\s*([0-9][0-9,\.]*)/)
    if (rangeMatch) {
      const a = Number(rangeMatch[1].replace(/,/g, ''))
      const b = Number(rangeMatch[2].replace(/,/g, ''))
      if (!Number.isNaN(a) && !Number.isNaN(b)) return (a + b) / 2
    }

    const numMatch = str.match(/([0-9][0-9,\.]*)/)
    if (!numMatch) return 0
    return Number(numMatch[1].replace(/,/g, ''))
  }

  const unitPriceNumber = priceToNumber(selectedMachine?.price)
  const totalPrice = unitPriceNumber * formData.quantity

  // Helper to get image source from machine data
  const getMachineImageSrc = (machine: typeof selectedMachine): string | undefined => {
    if (!machine) return undefined
    return machine.gallery?.[0] || machine.image || undefined
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.machineId) newErrors.machineId = 'Please select a machine'
      if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1'
      if (formData.quantity > 100) newErrors.quantity = 'Quantity cannot exceed 100'
    }

    if (step === 2) {
      if (!formData.customerInfo.fullName) newErrors.fullName = 'Full name is required'
      if (!formData.customerInfo.companyName) newErrors.companyName = 'Company name is required'
      if (!formData.customerInfo.email) newErrors.email = 'Email is required'
      if (!/\S+@\S+\.\S+/.test(formData.customerInfo.email)) newErrors.email = 'Please enter a valid email'
      if (!formData.customerInfo.phone) newErrors.phone = 'Phone number is required'
      if (!formData.customerInfo.address) newErrors.address = 'Address is required'
      if (!formData.customerInfo.city) newErrors.city = 'City is required'
    }

    if (step === 3) {
      if (!formData.deliveryInfo.preferredDate) newErrors.preferredDate = 'Preferred delivery date is required'
      if (!formData.deliveryInfo.deliveryAddress) newErrors.deliveryAddress = 'Delivery address is required'
    }

    if (step === 4) {
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    // IMPORTANT: use a human-readable email body (NOT JSON dump)
    const sanitize = (v: unknown) => {
      if (v === null || v === undefined) return '-'
      return String(v)
    }


    setIsSubmitting(true)

    setTimeout(() => {
      const orderId = Date.now()

      const submissionData = {
        ...formData,
        machineName: selectedMachine?.name,
        unitPrice: unitPriceNumber,
        totalPrice: totalPrice,
        orderId,
        status: 'pending'
      }

      // Persist for demo
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push({ ...submissionData, date: new Date().toISOString() })
      localStorage.setItem('orders', JSON.stringify(orders))

      setIsSubmitting(false)
      setIsSubmitted(true)
      onSubmit?.(submissionData)

      // Open email immediately so the company receives the request
      try {
        const companyEmail = 'cnyuondak@gmail.com'
        const subject = `New Order Request - Dukan Machinery (DUK-${orderId})`

        const body = [
          `Thank you for your order!`,
          ``,
          `Order ID: ${orderId}`,
          `Type: standard`,
          ``,
          `--- Machine ---`,
          `Machine: ${submissionData.machineName || submissionData.machineId || '-'}`,
          `Machine ID: ${submissionData.machineId || '-'}`,
          `Quantity: ${submissionData.quantity}`,
          `Unit Price (numeric): ${submissionData.unitPrice ?? 0}`,
          `Total Price (numeric): ${submissionData.totalPrice ?? 0}`,
          ``,
          `--- Customer ---`,
          `Name: ${submissionData.customerInfo?.fullName || '-'}`,
          `Company: ${submissionData.customerInfo?.companyName || '-'}`,
          `Email: ${submissionData.customerInfo?.email || '-'}`,
          `Phone: ${submissionData.customerInfo?.phone || '-'}`,
          `City: ${submissionData.customerInfo?.city || '-'}`,
          `Address: ${submissionData.customerInfo?.address || '-'}`,
          ``,
          `--- Delivery ---`,
          `Preferred Date: ${submissionData.deliveryInfo?.preferredDate || '-'}`,
          `Delivery Address: ${submissionData.deliveryInfo?.deliveryAddress || '-'}`,
          `Special Instructions: ${submissionData.deliveryInfo?.specialInstructions || '-'}`,
          ``,
          `--- Payment ---`,
          `Payment Method: ${submissionData.paymentMethod || '-'}`,
          `Terms Accepted: ${submissionData.termsAccepted ? 'Yes' : 'No'}`,
        ].join('%0A')
        window.location.href = `mailto:${companyEmail}?subject=${encodeURIComponent(subject)}&body=${body}`
      } catch (e) {
        console.error('Failed to open mail client', e)
      }
    }, 2000)
  }


  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const updateCustomerInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customerInfo: { ...prev.customerInfo, [field]: value }
    }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const updateDeliveryInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryInfo: { ...prev.deliveryInfo, [field]: value }
    }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
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
          Order Submitted Successfully!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for your order. Our team will contact you within 24 hours.
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Order Reference: <span className="font-mono font-semibold">DUK-{formData.machineId || '0000'}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            A confirmation email has been sent to {formData.customerInfo.email}
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
        >
          Return to Home
        </button>
      </motion.div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
      <h3 className="text-2xl font-black text-orange-500 dark:text-white mb-6 text-center">
        Place Your Order
      </h3>
      
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex-1 text-center">
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
              currentStep >= step ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {step}
            </div>
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              {step === 1 && 'Product'}
              {step === 2 && 'Customer'}
              {step === 3 && 'Delivery'}
              {step === 4 && 'Payment'}
            </p>
          </div>
        ))}
      </div>
      
      <div className="space-y-5">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Select Machine
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Machine *
                </label>
                <select
                  value={formData.machineId}
                  onChange={(e) => updateFormData('machineId', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Choose a machine...</option>
                  {machinesData.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {machine.name}
                    </option>
                  ))}
                </select>
                {errors.machineId && (
                  <p className="mt-1 text-sm text-red-500">{errors.machineId}</p>
                )}
              </div>

              {/* Machine Preview - FIXED IMAGE DISPLAY */}
              {selectedMachine && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
                      <SafeMachineImage 
                        src={getMachineImageSrc(selectedMachine)}
                        alt={selectedMachine.name}
                        machineName={selectedMachine.name}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {selectedMachine.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {selectedMachine.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-500">
                        ETB {unitPriceNumber ? unitPriceNumber.toLocaleString() : 'Call for price'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateFormData('quantity', Math.max(1, formData.quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-500 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => updateFormData('quantity', parseInt(e.target.value) || 1)}
                    className="w-24 text-center px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="1"
                    max="100"
                  />
                  <button
                    type="button"
                    onClick={() => updateFormData('quantity', Math.min(100, formData.quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-500 transition-colors"
                  >
                    +
                  </button>
                </div>
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
                )}
              </div>

              {/* Order Summary Preview */}
              {selectedMachine && (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Order Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Unit Price:</span>
                      <span>ETB {unitPriceNumber ? unitPriceNumber.toLocaleString() : 'Price on request'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span>{formData.quantity}</span>
                    </div>
                    <div className="flex justify-between font-bold text-orange-500 pt-2 border-t border-orange-200 dark:border-orange-900">
                      <span>Total:</span>
                      <span>ETB {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Customer Information */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Customer Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.customerInfo.fullName}
                      onChange={(e) => updateCustomerInfo('fullName', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your name"
                    />
                  </div>
                  {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.customerInfo.companyName}
                      onChange={(e) => updateCustomerInfo('companyName', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Company Name"
                    />
                  </div>
                  {errors.companyName && <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.customerInfo.email}
                      onChange={(e) => updateCustomerInfo('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="your@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.customerInfo.phone}
                      onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="+251 9XX XXX XXX"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      value={formData.customerInfo.address}
                      onChange={(e) => updateCustomerInfo('address', e.target.value)}
                      rows={2}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Street address"
                    />
                  </div>
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.customerInfo.city}
                    onChange={(e) => updateCustomerInfo('city', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="City"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Delivery Information */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Delivery Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Delivery Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.deliveryInfo.preferredDate}
                      onChange={(e) => updateDeliveryInfo('preferredDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  {errors.preferredDate && <p className="mt-1 text-sm text-red-500">{errors.preferredDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      value={formData.deliveryInfo.deliveryAddress}
                      onChange={(e) => updateDeliveryInfo('deliveryAddress', e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Full delivery address including building name, street, city"
                    />
                  </div>
                  {errors.deliveryAddress && <p className="mt-1 text-sm text-red-500">{errors.deliveryAddress}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={formData.deliveryInfo.specialInstructions}
                    onChange={(e) => updateDeliveryInfo('specialInstructions', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Any special delivery requirements or notes"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Payment & Review */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Payment & Review
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Payment Method *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => updateFormData('paymentMethod', 'bank_transfer')}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      formData.paymentMethod === 'bank_transfer'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-orange-500/50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-orange-500 mb-2" />
                    <p className="font-medium text-sm">Bank Transfer</p>
                    <p className="text-xs text-gray-500 mt-1">Direct bank wire transfer</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateFormData('paymentMethod', 'letter_of_credit')}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      formData.paymentMethod === 'letter_of_credit'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-orange-500/50'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-orange-500 mb-2" />
                    <p className="font-medium text-sm">Letter of Credit</p>
                    <p className="text-xs text-gray-500 mt-1">For international orders</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateFormData('paymentMethod', 'credit_card')}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      formData.paymentMethod === 'credit_card'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-orange-500/50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-orange-500 mb-2" />
                    <p className="font-medium text-sm">Credit Card</p>
                    <p className="text-xs text-gray-500 mt-1">Visa, Mastercard, Amex</p>
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Order Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Machine:</span>
                    <span className="font-medium">{selectedMachine?.name || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                    <span>{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Unit Price:</span>
                    <span>ETB {unitPriceNumber ? unitPriceNumber.toLocaleString() : 'Price on request'}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-orange-500 text-lg">
                      ETB {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
                  className="mt-1 w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <a href="/terms" className="text-orange-500 hover:underline">
                    Terms and Conditions
                  </a>{' '}
                  and confirm that all information provided is accurate.
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="text-sm text-red-500">{errors.termsAccepted}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleBack}
            className={`px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              currentStep === 1 ? 'invisible' : ''
            }`}
          >
            Back
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Place Order
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
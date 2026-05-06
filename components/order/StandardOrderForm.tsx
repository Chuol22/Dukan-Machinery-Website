// components/order/StandardOrderForm.tsx
'use client'

import { useState, useEffect } from 'react'
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
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Send,
  Save
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
    country: string
    postalCode: string
  }
  deliveryInfo: {
    preferredDate: string
    deliveryAddress: string
    specialInstructions: string
  }
  paymentMethod: 'bank_transfer' | 'letter_of_credit' | 'credit_card'
  termsAccepted: boolean
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
      country: '',
      postalCode: '',
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

  const selectedMachine = machinesData.find(m => m.id === formData.machineId)
  const totalPrice = selectedMachine?.price ? selectedMachine.price * formData.quantity : 0

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.machineId) newErrors.machineId = 'Please select a machine'
      if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1'
      if (formData.quantity > 100) newErrors.quantity = 'For bulk orders (>100), please contact sales'
    }

    if (step === 2) {
      if (!formData.customerInfo.fullName) newErrors.fullName = 'Full name is required'
      if (!formData.customerInfo.companyName) newErrors.companyName = 'Company name is required'
      if (!formData.customerInfo.email) newErrors.email = 'Email is required'
      if (!/\S+@\S+\.\S+/.test(formData.customerInfo.email)) newErrors.email = 'Email is invalid'
      if (!formData.customerInfo.phone) newErrors.phone = 'Phone number is required'
      if (!formData.customerInfo.address) newErrors.address = 'Address is required'
      if (!formData.customerInfo.city) newErrors.city = 'City is required'
      if (!formData.customerInfo.country) newErrors.country = 'Country is required'
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

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const submissionData = {
        ...formData,
        machineName: selectedMachine?.name,
        unitPrice: selectedMachine?.price,
        totalPrice: totalPrice,
        orderId: Date.now(),
        status: 'pending'
      }
      console.log('Order submitted:', submissionData)
      setIsSubmitting(false)
      setIsSubmitted(true)
      onSubmit?.(submissionData)
      
      // Save to localStorage for demo
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push({ ...submissionData, date: new Date().toISOString() })
      localStorage.setItem('orders', JSON.stringify(orders))
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
        className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Order Received!
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Thank you for your order. Our sales team will contact you within 24 hours to confirm the details.
        </p>
        <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Order Reference: <span className="font-mono font-semibold">DUK-{Date.now()}</span>
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            We've sent a confirmation email to {formData.customerInfo.email}
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
    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-8 shadow-xl">
      <h3 className="text-2xl font-black text-primary dark:text-white mb-6 text-center">
        Standard Order
      </h3>
      
      <div className="space-y-5">
        <AnimatePresence mode="wait">
          {/* Step 1: Product Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Select Your Machine
              </h3>

              {/* Machine Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Machine *
                </label>
                <select
                  value={formData.machineId}
                  onChange={(e) => updateFormData('machineId', e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a machine...</option>
                  {machinesData.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {machine.name} - {machine.capacity}
                    </option>
                  ))}
                </select>
                {errors.machineId && (
                  <p className="mt-1 text-sm text-red-500">{errors.machineId}</p>
                )}
              </div>

              {/* Machine Preview */}
              {selectedMachine && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src={selectedMachine.images[0]}
                        alt={selectedMachine.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-900 dark:text-white">
                        {selectedMachine.name}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Capacity: {selectedMachine.capacity.min}-{selectedMachine.capacity.max} {selectedMachine.capacity.unit}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Power: {selectedMachine.power.required} {selectedMachine.power.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ${selectedMachine.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Quantity *
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateFormData('quantity', Math.max(1, formData.quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => updateFormData('quantity', parseInt(e.target.value) || 1)}
                    className="w-24 text-center px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                    max="100"
                  />
                  <button
                    type="button"
                    onClick={() => updateFormData('quantity', Math.min(100, formData.quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary transition-colors"
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
                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                    Order Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Unit Price:</span>
                      <span>${selectedMachine.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span>{formData.quantity}</span>
                    </div>
                    <div className="flex justify-between font-bold text-primary pt-2 border-t border-primary/20">
                      <span>Total:</span>
                      <span>${totalPrice.toLocaleString()}</span>
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
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Customer Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={formData.customerInfo.fullName}
                      onChange={(e) => updateCustomerInfo('fullName', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={formData.customerInfo.companyName}
                      onChange={(e) => updateCustomerInfo('companyName', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="ABC Industries"
                    />
                  </div>
                  {errors.companyName && <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      value={formData.customerInfo.email}
                      onChange={(e) => updateCustomerInfo('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="tel"
                      value={formData.customerInfo.phone}
                      onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                    <textarea
                      value={formData.customerInfo.address}
                      onChange={(e) => updateCustomerInfo('address', e.target.value)}
                      rows={2}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Street address"
                    />
                  </div>
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.customerInfo.city}
                    onChange={(e) => updateCustomerInfo('city', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="City"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Country *
                  </label>
                  <select
                    value={formData.customerInfo.country}
                    onChange={(e) => updateCustomerInfo('country', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select country</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.customerInfo.postalCode}
                    onChange={(e) => updateCustomerInfo('postalCode', e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Postal code"
                  />
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
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Delivery Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Preferred Delivery Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="date"
                      value={formData.deliveryInfo.preferredDate}
                      onChange={(e) => updateDeliveryInfo('preferredDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {errors.preferredDate && <p className="mt-1 text-sm text-red-500">{errors.preferredDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                    <textarea
                      value={formData.deliveryInfo.deliveryAddress}
                      onChange={(e) => updateDeliveryInfo('deliveryAddress', e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Full delivery address including building name, street, city, country"
                    />
                  </div>
                  {errors.deliveryAddress && <p className="mt-1 text-sm text-red-500">{errors.deliveryAddress}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={formData.deliveryInfo.specialInstructions}
                    onChange={(e) => updateDeliveryInfo('specialInstructions', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Payment & Review
              </h3>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Payment Method *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard },
                    { value: 'letter_of_credit', label: 'Letter of Credit', icon: FileText },
                    { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => updateFormData('paymentMethod', method.value)}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        formData.paymentMethod === method.value
                          ? 'border-primary bg-primary/5'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-primary/50'
                      }`}
                    >
                      <method.icon className="w-5 h-5 text-primary mb-2" />
                      <p className="font-medium text-sm">{method.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">
                  Order Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Machine:</span>
                    <span className="font-medium">{selectedMachine?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Price:</span>
                    <span>${selectedMachine?.price?.toLocaleString() || 'Price on request'}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-neutral-300 dark:border-neutral-600">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-primary text-lg">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <label htmlFor="terms" className="text-sm text-neutral-600 dark:text-neutral-400">
                  I agree to the{' '}
                  <a href="/terms" className="text-primary hover:underline">
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

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <button
            onClick={handleBack}
            className={`px-6 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
              currentStep === 1 ? 'invisible' : ''
            }`}
          >
            Back
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
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
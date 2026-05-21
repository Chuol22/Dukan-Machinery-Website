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

  const selectedMachine = machinesData.find(m => m.id === Number(formData.machineId))
  // FIX 1: Convert price string to number
  const totalPrice = (Number(selectedMachine?.price) || 0) * formData.quantity

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.machineId) newErrors.machineId = 'standardOrder.validation.machineRequired'
      if (formData.quantity < 1) newErrors.quantity = 'standardOrder.quantityMinError'
      if (formData.quantity > 100) newErrors.quantity = 'standardOrder.quantityMaxError'
    }

    if (step === 2) {
      if (!formData.customerInfo.fullName) newErrors.fullName = 'standardOrder.validation.fullNameRequired'
      if (!formData.customerInfo.companyName) newErrors.companyName = 'standardOrder.validation.companyNameRequired'
      if (!formData.customerInfo.email) newErrors.email = 'standardOrder.validation.emailRequired'
      if (!/\S+@\S+\.\S+/.test(formData.customerInfo.email)) newErrors.email = 'standardOrder.validation.emailInvalid'
      if (!formData.customerInfo.phone) newErrors.phone = 'standardOrder.validation.phoneRequired'
      if (!formData.customerInfo.address) newErrors.address = 'standardOrder.validation.addressRequired'
      if (!formData.customerInfo.city) newErrors.city = 'standardOrder.validation.cityRequired'
      if (!formData.customerInfo.country) newErrors.country = 'standardOrder.validation.countryRequired'
    }

    if (step === 3) {
      if (!formData.deliveryInfo.preferredDate) newErrors.preferredDate = 'standardOrder.validation.preferredDateRequired'
      if (!formData.deliveryInfo.deliveryAddress) newErrors.deliveryAddress = 'standardOrder.validation.deliveryAddressRequired'
    }

    if (step === 4) {
      if (!formData.termsAccepted) newErrors.termsAccepted = 'standardOrder.validation.termsRequired'
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
      // FIX 2: Convert price to number in submission data
      const submissionData = {
        ...formData,
        machineName: selectedMachine?.name,
        unitPrice: Number(selectedMachine?.price) || 0,
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
            Order Reference: <span className="font-mono font-semibold">DUK-{Date.now()}</span>
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
      
      {/* Step Indicator */}
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
          {/* Step 1: Product Selection */}
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

              {/* Machine Selection */}
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

              {/* Machine Preview */}
              {selectedMachine && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex gap-4">
                    {selectedMachine.image && (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={selectedMachine.image}
                          alt={selectedMachine.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {selectedMachine.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {selectedMachine.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-500">
                        {/* FIX 3: Convert string price to number for toLocaleString */}
                        ${Number(selectedMachine.price)?.toLocaleString() || 'Call for price'}
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
                      <span>
                        {/* FIX 4: Convert string price to number */}
                        ${Number(selectedMachine.price)?.toLocaleString() || 'Price on request'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span>{formData.quantity}</span>
                    </div>
                    <div className="flex justify-between font-bold text-orange-500 pt-2 border-t border-orange-200 dark:border-orange-900">
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
                      placeholder="John Doe"
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
                      placeholder="john@company.com"
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
                      placeholder="+1234567890"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country *
                  </label>
                  <select
                    value={formData.customerInfo.country}
                    onChange={(e) => updateCustomerInfo('country', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Country</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.customerInfo.postalCode}
                    onChange={(e) => updateCustomerInfo('postalCode', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Postal Code"
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
                      placeholder="Full delivery address including building name, street, city, country"
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

              {/* Payment Method */}
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

              {/* Order Summary */}
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
                    <span>
                      {/* FIX 5: Convert string price to number */}
                      ${Number(selectedMachine?.price)?.toLocaleString() || 'Price on request'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-orange-500 text-lg">
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

        {/* Navigation Buttons */}
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
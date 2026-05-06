// components/order/OrderSummary.tsx
'use client'

import { Download, Printer, Mail, Package, Clock, CheckCircle, AlertCircle, CreditCard, Shield } from 'lucide-react'

interface OrderSummaryProps {
  orderData: any
  type: 'standard' | 'custom'
}

export default function OrderSummary({ orderData, type }: OrderSummaryProps) {
  const handleDownload = () => {
    const dataStr = JSON.stringify(orderData, null, 2)
    const link = document.createElement('a')
    link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    link.download = `order-${orderData.orderId || Date.now()}.json`
    link.click()
  }

  const handleEmail = () => {
    window.location.href = `mailto:?subject=Order Summary - Dukan Machinery&body=Thank you for your order! Order ID: ${orderData.orderId || Date.now()}`
  }

  const getStatusIcon = () => {
    if (orderData.status === 'confirmed') return <CheckCircle className="w-16 h-16 text-green-500" />
    if (orderData.status === 'cancelled') return <AlertCircle className="w-16 h-16 text-red-500" />
    return <Package className="w-16 h-16 text-primary" />
  }

  const getStatusText = () => {
    if (orderData.status === 'confirmed') return 'Order Confirmed'
    if (orderData.status === 'cancelled') return 'Order Cancelled'
    return 'Order Received'
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-8 text-white text-center">
        {getStatusIcon()}
        <h2 className="text-2xl font-bold mt-4">{getStatusText()}</h2>
        <p className="text-white/80 mt-1">Order ID: {orderData.orderId || `DUK-${Date.now()}`}</p>
        <p className="text-white/60 text-sm mt-1">{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex justify-end gap-3 mb-6 print:hidden">
          <button onClick={handleDownload} className="p-2 text-neutral-600 hover:text-primary"><Download className="w-5 h-5" /></button>
          <button onClick={handleEmail} className="p-2 text-neutral-600 hover:text-primary"><Mail className="w-5 h-5" /></button>
        </div>

        <div className="space-y-6">
          <div><h3 className="text-lg font-semibold mb-3">Customer Information</h3><div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4"><p><span className="font-medium">Name:</span> {orderData.customerInfo?.fullName || orderData.contactInfo?.name}</p><p className="mt-1"><span className="font-medium">Company:</span> {orderData.customerInfo?.companyName || orderData.contactInfo?.company}</p><p className="mt-1"><span className="font-medium">Email:</span> {orderData.customerInfo?.email || orderData.contactInfo?.email}</p><p className="mt-1"><span className="font-medium">Phone:</span> {orderData.customerInfo?.phone || orderData.contactInfo?.phone}</p></div></div>

          <div><h3 className="text-lg font-semibold mb-3">Order Items</h3><div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">{type === 'standard' ? (<div className="space-y-2"><div className="flex justify-between"><span className="font-medium">Machine:</span><span>{orderData.machineName}</span></div><div className="flex justify-between"><span className="font-medium">Quantity:</span><span>{orderData.quantity}</span></div><div className="flex justify-between"><span className="font-medium">Unit Price:</span><span>${orderData.unitPrice?.toLocaleString()}</span></div><div className="flex justify-between pt-2 border-t"><span className="font-bold">Total:</span><span className="font-bold text-primary text-lg">${orderData.totalPrice?.toLocaleString()}</span></div></div>) : (<div className="space-y-2"><div className="flex justify-between"><span className="font-medium">Feed Type:</span><span>{orderData.feedType}</span></div><div className="flex justify-between"><span className="font-medium">Capacity:</span><span>{orderData.requiredCapacity?.value} {orderData.requiredCapacity?.unit}</span></div><div className="flex justify-between"><span className="font-medium capitalize">Power Source:</span><span>{orderData.powerSource}</span></div><div className="flex justify-between"><span className="font-medium capitalize">Timeline:</span><span>{orderData.timeline}</span></div></div>)}</div></div>

          {orderData.paymentMethod && (<div><h3 className="text-lg font-semibold mb-3">Payment Information</h3><div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4"><div className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /><span className="font-medium capitalize">{orderData.paymentMethod.replace('_', ' ')}</span></div></div></div>)}

          <div className="border-t pt-6"><h3 className="text-lg font-semibold mb-3">Next Steps</h3><div className="space-y-3"><div className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-primary text-sm font-bold">1</span></div><p>Our sales team will contact you within <strong className="text-primary">24 hours</strong> to confirm your order.</p></div><div className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-primary text-sm font-bold">2</span></div><p>You will receive a proforma invoice and payment instructions via email.</p></div><div className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-primary text-sm font-bold">3</span></div><p>Production begins after payment confirmation. Lead time: 4-8 weeks.</p></div></div></div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start gap-3"><Shield className="w-5 h-5 text-blue-500 flex-shrink-0" /><div><p className="text-sm font-medium text-blue-800">Need help with your order?</p><p className="text-sm text-blue-600 mt-1">Contact us at <strong>support@dukanmachinery.com</strong> or call <strong>+971 4 123 4567</strong></p></div></div>
        </div>
      </div>
    </div>
  )
}
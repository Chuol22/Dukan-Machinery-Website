'use client'

import { motion } from 'framer-motion'
import { Factory } from 'lucide-react'

export default function ManufacturingPhilosophy() {
  return (
    <section className="bg-linear-to-r from-green-900 to-green-800 text-white rounded-3xl p-6 sm:p-12 shadow-sm text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Factory className="text-orange-400 mx-auto mb-4 animate-float" size={56} />
        <h3 className="text-3xl text-orange-300 font-black mb-4">Manufacturing Philosophy</h3>
        <p className="max-w-3xl mx-auto text-white/80 leading-relaxed">
          We believe in building machines that last. Every component is sourced for durability, every weld is
          inspected, and every machine is tested before leaving our factory.
        </p>
      </motion.div>
    </section>
  )
}


'use client'

import { useState, useEffect } from 'react'
import type { Machine } from '../data/machinesData'

export function useMachinesData() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    
    // Lazy load the data
    import('../data/machinesData')
      .then((module) => {
        if (mounted) {
          setMachines(module.machinesData)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return { machines, loading, error }
}
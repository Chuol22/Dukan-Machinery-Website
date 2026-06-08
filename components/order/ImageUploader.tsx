'use client'

// ImageUploader — drag-and-drop image picker with preview grid
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, AlertCircle, Trash2, Eye, FileImage } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  onImagesUploaded: (files: File[]) => void
  maxImages?: number
  maxSize?: number
}

export default function ImageUploader({ onImagesUploaded, maxImages = 5, maxSize = 5 }: ImageUploaderProps) {
  // Uploaded files, preview URLs, and drag state
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validate file type and size against limits
  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) return 'File type not supported. Please upload an image'
    if (file.size > maxSize * 1024 * 1024) return `File size exceeds ${maxSize}MB limit`
    return null
  }

  // Process dropped or selected files
  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const newImages: File[] = []
    const newPreviews: string[] = []
    const newErrors: string[] = []

    Array.from(files).forEach(file => {
      const error = validateFile(file)
      if (error) newErrors.push(`${file.name}: ${error}`)
      else if (images.length + newImages.length >= maxImages) newErrors.push(`Maximum ${maxImages} images allowed`)
      else { newImages.push(file); newPreviews.push(URL.createObjectURL(file)) }
    })

    if (newErrors.length) { setErrors(prev => [...prev, ...newErrors]); setTimeout(() => setErrors([]), 5000) }
    if (newImages.length) {
      const updated = [...images, ...newImages]
      setImages(updated); setPreviews([...previews, ...newPreviews])
      onImagesUploaded(updated)
    }
  }

  // Remove image and revoke its object URL
  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index])
    const updated = images.filter((_, i) => i !== index)
    setImages(updated); setPreviews(previews.filter((_, i) => i !== index))
    onImagesUploaded(updated)
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }} onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'} ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)} className="hidden" disabled={images.length >= maxImages} />
        <div className="flex flex-col items-center gap-3"><div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"><Upload className="w-8 h-8 text-primary" /></div><div><p className="font-medium">Drag & drop or click to upload</p><p className="text-sm text-gray-500 mt-1">Images only • Max {maxImages} images • Up to {maxSize}MB each</p></div></div>
        {isDragging && <div className="absolute inset-0 bg-primary/10 rounded-xl flex items-center justify-center"><p className="text-primary font-semibold">Drop files here</p></div>}
      </div>

      {/* Preview thumbnails */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence>{previews.map((preview, index) => (<motion.div key={preview} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative group"><div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"><Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" /><div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"><button onClick={() => window.open(preview, '_blank')} className="p-1.5 bg-white rounded-lg hover:bg-primary hover:text-white"><Eye className="w-4 h-4" /></button><button onClick={() => removeImage(index)} className="p-1.5 bg-white rounded-lg hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" /></button></div><div className="absolute bottom-1 left-1 right-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white px-1.5 py-0.5 truncate">{images[index].name}</div><div className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white px-1.5 py-0.5">{(images[index].size / 1024 / 1024).toFixed(1)} MB</div></div></motion.div>))}</AnimatePresence>
        </div>
      )}

      {/* Validation errors */}
      <AnimatePresence>{errors.length > 0 && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-3"><div className="flex items-start gap-2"><AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" /><div><p className="text-sm font-medium text-red-800">Upload Errors:</p><ul className="mt-1 text-xs text-red-700 list-disc list-inside">{errors.map((error, idx) => <li key={idx}>{error}</li>)}</ul></div></div></motion.div>)}</AnimatePresence>

      {/* Upload tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3"><div className="flex items-start gap-2"><FileImage className="w-4 h-4 text-blue-500 flex-shrink-0" /><div className="text-xs text-blue-800"><p className="font-medium mb-1">Tips for best results:</p><ul className="list-disc list-inside space-y-0.5"><li>Use clear, well-lit photos showing the installation area</li><li>Include dimensions or measurements if possible</li><li>Take photos from multiple angles</li></ul></div></div></div>
    </div>
  )
}
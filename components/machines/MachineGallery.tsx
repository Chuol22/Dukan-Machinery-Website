'use client';

// MachineGallery — main image viewer with thumbnails and lightbox
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import OptimizedImage from '@/components/shared/OptimizedImage';

interface MachineGalleryProps {
  images: string[];
  productName: string;
}

export default function MachineGallery({ images, productName }: MachineGalleryProps) {
  // Current slide and full-screen lightbox state
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div 
          className="relative h-80 md:h-96 bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
        >
          {images[selectedImage].endsWith('.mp4') ? (
            <video 
              src={images[selectedImage]} 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <OptimizedImage
              src={images[selectedImage]}
              alt={productName}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              style={{ objectFit: 'contain' }}
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-black">Click to enlarge</span>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                  selectedImage === index 
                    ? 'border-orange-500 ring-2 ring-orange-500/50' 
                    : 'border-transparent hover:border-orange-500/50'
                }`}
              >
                {image.endsWith('.mp4') ? (
                <video 
                  src={image} 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <OptimizedImage
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ objectFit: 'cover' }}
                />
              )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setIsModalOpen(false)}>
          <button
            type="button"
            aria-label="Close image preview"
            title="Close"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-orange-500 transition z-10"
          >
            <X size={32} />
          </button>
          
          <button
            type="button"
            aria-label="Previous image"
            title="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
            }}
            className="absolute left-4 text-white hover:text-orange-500 transition"
          >
            <ChevronLeft size={40} />
          </button>

          {images[selectedImage].endsWith('.mp4') ? (
            <video 
              src={images[selectedImage]} 
              autoPlay 
              muted 
              loop 
              playsInline
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <OptimizedImage
              src={images[selectedImage]}
              alt={productName}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              style={{ objectFit: 'contain' }}
            />
          )}

          <button
            type="button"
            aria-label="Next image"
            title="Next image"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-4 text-white hover:text-orange-500 transition"
          >
            <ChevronRight size={40} />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
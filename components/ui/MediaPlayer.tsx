'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface MediaPlayerProps {
  src: string
  alt: string
  className?: string
}

export function MediaPlayer({ src, alt, className = '' }: MediaPlayerProps) {
  const [isVideo, setIsVideo] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsVideo(src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov'))
  }, [src])

  if (isVideo) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        )}
        <video
          src={src}
          className="w-full h-full object-cover"
          onLoadedData={() => setIsLoading(false)}
          muted
          autoPlay
          loop
          playsInline
        />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onLoadingComplete={() => setIsLoading(false)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
import { useEffect, useCallback } from 'react';
import { type LodgeImage } from '../data/lodges';

interface LightboxProps {
  images: LodgeImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  lodgeName: string;
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
  lodgeName,
}: LightboxProps) {
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < images.length - 1;

  const handlePrev = useCallback(() => {
    if (canGoPrev) onNavigate(currentIndex - 1);
  }, [canGoPrev, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (canGoNext) onNavigate(currentIndex + 1);
  }, [canGoNext, currentIndex, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, handlePrev, handleNext]);

  // Preload adjacent full-size images
  useEffect(() => {
    const preload = (index: number) => {
      if (index >= 0 && index < images.length) {
        const img = new Image();
        img.src = images[index].full;
      }
    };
    preload(currentIndex - 1);
    preload(currentIndex + 1);
  }, [currentIndex, images]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous button */}
      <button
        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        disabled={!canGoPrev}
        className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 ${
          canGoPrev ? 'hover:bg-white/20 text-white' : 'text-white/30 cursor-not-allowed'
        }`}
        aria-label="Previous image"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
        disabled={!canGoNext}
        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 ${
          canGoNext ? 'hover:bg-white/20 text-white' : 'text-white/30 cursor-not-allowed'
        }`}
        aria-label="Next image"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image */}
      <img
        src={images[currentIndex].full}
        alt={`${lodgeName} - Image ${currentIndex + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

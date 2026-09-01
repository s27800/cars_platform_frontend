import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCloseOutline,
  IoExpandOutline,
  IoImageOutline,
} from 'react-icons/io5';
import { IconButton } from '../../shared/components/ui';


// Image gallery component with thumbnail navigation and lightbox mode
const ImageGallery = ({ images = [], carName = 'Car' }) => {
  const { t } = useTranslation('cars');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const validImages = images.filter(img => img?.imageUrl);

  // Keyboard navigation in lightbox mode
  const handleKeyDown = useCallback((event) => {
    if (!isLightboxOpen) return;

    switch (event.key) {
      case 'ArrowLeft':
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : validImages.length - 1));
        break;
      case 'ArrowRight':
        setSelectedIndex(prev => (prev < validImages.length - 1 ? prev + 1 : 0));
        break;
      case 'Escape':
        setIsLightboxOpen(false);
        break;
      default:
        break;
    }
  }, [isLightboxOpen, validImages.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  // Navigation handlers
  const goToPrevious = () => {
    setSelectedIndex(prev => (prev > 0 ? prev - 1 : validImages.length - 1));
  };

  const goToNext = () => {
    setSelectedIndex(prev => (prev < validImages.length - 1 ? prev + 1 : 0));
  };

  // Placeholder
  if (validImages.length === 0) {
    return (
      <div className="aspect-[16/9] bg-neutral-100 dark:bg-neutral-700 rounded-2xl flex items-center justify-center">
        <div className="text-center text-neutral-400">
          <IoImageOutline className="w-16 h-16 mx-auto mb-2" />
          <p>{t('details.noImages')}</p>
        </div>
      </div>
    );
  }

  const currentImage = validImages[selectedIndex];

  return (
    <>
      <div className="space-y-3">

        {/* Main Image */}
        <div className="relative aspect-[16/9] bg-neutral-100 dark:bg-neutral-700 rounded-2xl overflow-hidden group">
          <img
            src={currentImage.imageUrl}
            alt={`${carName} - Image ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Navigation arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label={t('gallery.previousImage')}
              >
                <IoChevronBackOutline className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label={t('gallery.nextImage')}
              >
                <IoChevronForwardOutline className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Expand button */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label={t('gallery.openFullscreen')}
          >
            <IoExpandOutline className="w-5 h-5" />
          </button>

          {/* Image counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
              {selectedIndex + 1} / {validImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {validImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {validImages.map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => setSelectedIndex(index)}
                className={`
                  flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden
                  border-2 transition-all
                  ${index === selectedIndex
                    ? 'border-primary-500 ring-2 ring-primary-500/30'
                    : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                  }
                `}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image.imageUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <IconButton
            variant="ghost"
            size="lg"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            aria-label={t('gallery.closeFullscreen')}
          >
            <IoCloseOutline className="w-6 h-6" />
          </IconButton>

          {/* Navigation arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label={t('gallery.previousImage')}
              >
                <IoChevronBackOutline className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label={t('gallery.nextImage')}
              >
                <IoChevronForwardOutline className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main image */}
          <img
            src={currentImage.imageUrl}
            alt={`${carName} - Image ${selectedIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
            {selectedIndex + 1} / {validImages.length}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ImageGallery;

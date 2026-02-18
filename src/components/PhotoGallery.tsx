import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PhotoGalleryProps {
  photos: string[];
  activityName: string;
  onClose: () => void;
  onDeletePhoto?: (photoIndex: number) => void;
  canEdit?: boolean;
}

const PhotoGallery = ({ photos, activityName, onClose, onDeletePhoto, canEdit = false }: PhotoGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleDelete = () => {
    if (onDeletePhoto) {
      onDeletePhoto(currentIndex);
      setShowDeleteConfirm(false);
      if (currentIndex >= photos.length - 1) {
        setCurrentIndex(Math.max(0, photos.length - 2));
      }
    }
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.95)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Close Button */}
      <motion.button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X size={24} className="text-white" />
      </motion.button>

      {/* Delete Button */}
      {canEdit && onDeletePhoto && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
          className="absolute top-4 right-16 z-50 p-2 rounded-full bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={20} className="text-red-400" />
        </motion.button>
      )}

      {/* Main Content */}
      <div
        className="relative max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <img
            src={photos[currentIndex]}
            alt={`${activityName} - Photo ${currentIndex + 1}`}
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          />
        </motion.div>

        {/* Navigation Arrows (if multiple photos) */}
        {photos.length > 1 && (
          <>
            <motion.button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={28} className="text-white" />
            </motion.button>

            <motion.button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={28} className="text-white" />
            </motion.button>
          </>
        )}

        {/* Photo Counter */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
            <span className="text-white text-sm font-medium">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>
        )}

        {/* Info Bar */}
        <motion.div
          className="mt-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-white text-lg font-semibold">{activityName}</h3>
        </motion.div>
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2C1810' }}>
                Delete Photo?
              </h3>
              <p className="text-sm text-[#8B7355] mb-6">
                This photo will be permanently removed. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    background: 'rgba(111, 78, 55, 0.08)',
                    color: '#6F4E37',
                    border: '1px solid rgba(111, 78, 55, 0.12)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 rounded-full text-sm font-semibold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PhotoGallery;

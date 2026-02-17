import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Star, Sparkles } from 'lucide-react';
import type { Activity, Feedback, User } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  activity: Activity | null;
  currentUser: User;
  onClose: () => void;
  onSave: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
}

const ratingLabels = ['', 'Not great...', 'It was okay', 'Pretty good!', 'Loved it!', 'Absolutely amazing! 💕'];

const FeedbackModal = ({ isOpen, activity, currentUser, onClose, onSave }: FeedbackModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const isAMR = currentUser === 'AMR';
  const userColor = isAMR ? '#DC2626' : '#1a1a1a';

  useEffect(() => {
    if (activity) {
      const existingFeedback = activity.feedbacks.find(f => f.user === currentUser);
      if (existingFeedback) {
        setRating(existingFeedback.rating);
        setComment(existingFeedback.comment);
      } else {
        setRating(0);
        setComment('');
      }
    }
  }, [activity, currentUser]);

  const handleSubmit = () => {
    if (!activity || rating === 0) return;
    onSave({
      activityId: activity.id,
      user: currentUser,
      rating,
      comment,
    });
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && activity && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(44, 24, 16, 0.4)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[380px] px-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 20px 50px rgba(44, 24, 16, 0.18)',
                border: '1.5px solid rgba(212, 165, 116, 0.15)',
              }}
            >
              {/* Top bar */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${userColor}, #D4A574)` }} />

              <div className="px-5 py-5">
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#D4A574]" />
                    <h2
                      className="text-lg font-bold"
                      style={{ fontFamily: "'Playfair Display', serif", color: '#2C1810' }}
                    >
                      How was it?
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#B8A08A] hover:text-[#4A3428] hover:bg-[#F5E6D3] transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Activity name + user */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-[#8B7355]">
                    About <span className="font-semibold text-[#4A3428]">{activity.name}</span>
                  </p>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ background: userColor }}
                  >
                    {currentUser}
                  </span>
                </div>

                {/* Stars */}
                <div className="mb-1">
                  <p className="text-xs font-medium text-[#4A3428] mb-2">Your Rating</p>
                  <div className="flex gap-1.5 justify-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5"
                      >
                        <Star
                          size={28}
                          fill={(hoverRating || rating) >= star ? '#D4A574' : 'transparent'}
                          stroke={(hoverRating || rating) >= star ? '#D4A574' : '#D1D5DB'}
                          strokeWidth={1.5}
                        />
                      </motion.button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-xs text-[#8B7355] mt-1"
                    >
                      {ratingLabels[rating]}
                    </motion.p>
                  )}
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-[#4A3428] mb-1.5">Your Thoughts</p>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="What was your favorite part?"
                    rows={3}
                    className="w-full text-sm resize-none rounded-xl px-3 py-2.5"
                    style={{
                      background: 'rgba(245, 230, 211, 0.4)',
                      border: '1px solid rgba(212, 165, 116, 0.2)',
                      color: '#2C1810',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  <motion.button
                    onClick={onClose}
                    className="px-4 py-2 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(111, 78, 55, 0.08)',
                      color: '#6F4E37',
                      border: '1px solid rgba(111, 78, 55, 0.12)',
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #6F4E37, #4A3428)',
                      boxShadow: '0 3px 10px rgba(74, 52, 40, 0.2)',
                    }}
                    whileHover={rating > 0 ? { scale: 1.03 } : {}}
                    whileTap={rating > 0 ? { scale: 0.97 } : {}}
                  >
                    Save Feedback
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;

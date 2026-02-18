import { motion } from 'framer-motion';
import { CheckCircle, Clock, MessageCircle, Star, Calendar, Trash2, Sparkles, Pencil, Image } from 'lucide-react';
import type { Activity, User } from '../types';

interface ActivityCardProps {
  activity: Activity;
  currentUser: User;
  onComplete: (activity: Activity) => void;
  onAddFeedback: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onViewPhotos?: (activity: Activity) => void;
}

const AMR_COLOR = '#DC2626';
const ASEI_COLOR = '#1a1a1a';

const ActivityCard = ({ activity, currentUser, onComplete, onAddFeedback, onDelete, onEdit, onViewPhotos }: ActivityCardProps) => {
  const amrFeedback = activity.feedbacks.find(f => f.user === 'AMR');
  const aseiFeedback = activity.feedbacks.find(f => f.user === 'ASEI');
  const currentUserFeedback = activity.feedbacks.find(f => f.user === currentUser);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={13}
        fill={i < rating ? '#D4A574' : 'transparent'}
        stroke={i < rating ? '#D4A574' : '#D1D5DB'}
        strokeWidth={1.5}
      />
    ));
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,230,211,0.85))',
        boxShadow: '0 4px 24px rgba(44, 24, 16, 0.08), 0 1px 3px rgba(44, 24, 16, 0.05)',
        border: '1px solid rgba(212, 165, 116, 0.15)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        boxShadow: '0 12px 40px rgba(44, 24, 16, 0.12), 0 2px 6px rgba(44, 24, 16, 0.06)',
      }}
      transition={{ duration: 0.2 }}
      layout
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background: activity.isCompleted
            ? 'linear-gradient(90deg, #059669, #34d399)'
            : 'linear-gradient(90deg, #D4A574, #C8A96A)',
        }}
      />

      <div className="p-5 sm:p-6">
        {/* Header row: Letter badge + Title + Status */}
        <div className="flex items-start gap-3.5 mb-4">
          {/* Letter Badge — circular */}
          <motion.div
            className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
            style={{
              background: activity.isCompleted
                ? 'linear-gradient(135deg, #059669, #047857)'
                : 'linear-gradient(135deg, #6F4E37, #4A3428)',
            }}
            whileHover={{ scale: 1.08, rotate: 3 }}
          >
            <span
              className="text-lg font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {activity.letter}
            </span>
          </motion.div>

          {/* Title & Date */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-bold truncate pr-6"
              style={{ fontFamily: "'Playfair Display', serif", color: '#2C1810' }}
            >
              {activity.name}
            </h3>
            {activity.completedDate && (
              <div className="flex items-center gap-1.5 text-xs text-[#8B7355] mt-1">
                <Calendar size={12} />
                <span>{new Date(activity.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            )}
            {!activity.isCompleted && (
              <div className="flex items-center gap-1.5 text-xs text-[#D4A574] mt-1">
                <Clock size={12} />
                <span>Awaiting adventure...</span>
              </div>
            )}
          </div>

          {/* Status icon */}
          {activity.isCompleted && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex-shrink-0"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle className="text-emerald-500" size={18} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Feedbacks Section — cleaner layout */}
        {activity.isCompleted && (
          <div className="space-y-2 mb-4">
            {/* AMR Feedback */}
            <div
              className="p-3 rounded-xl transition-colors"
              style={{
                background: amrFeedback ? 'rgba(220, 38, 38, 0.04)' : 'rgba(0,0,0,0.02)',
                border: amrFeedback ? '1px solid rgba(220, 38, 38, 0.1)' : '1px solid transparent',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <img src="/p.png" alt="Pisces" className="w-4 h-4 rounded-full object-cover ring-1 ring-red-200" />
                <span className="font-bold text-xs" style={{ color: AMR_COLOR }}>AMR</span>
                {amrFeedback && <div className="flex gap-0.5 ml-auto">{renderStars(amrFeedback.rating)}</div>}
              </div>
              {amrFeedback ? (
                <p className="text-sm text-[#4A3428] italic pl-6 leading-relaxed">"{amrFeedback.comment}"</p>
              ) : (
                <p className="text-xs text-[#B8A08A] pl-6 italic">Awaiting thoughts...</p>
              )}
            </div>

            {/* ASEI Feedback */}
            <div
              className="p-3 rounded-xl transition-colors"
              style={{
                background: aseiFeedback ? 'rgba(26, 26, 26, 0.04)' : 'rgba(0,0,0,0.02)',
                border: aseiFeedback ? '1px solid rgba(26, 26, 26, 0.08)' : '1px solid transparent',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <img src="/s.png" alt="Scorpio" className="w-4 h-4 rounded-full object-cover ring-1 ring-gray-200" />
                <span className="font-bold text-xs" style={{ color: ASEI_COLOR }}>ASEI</span>
                {aseiFeedback && <div className="flex gap-0.5 ml-auto">{renderStars(aseiFeedback.rating)}</div>}
              </div>
              {aseiFeedback ? (
                <p className="text-sm text-[#4A3428] italic pl-6 leading-relaxed">"{aseiFeedback.comment}"</p>
              ) : (
                <p className="text-xs text-[#B8A08A] pl-6 italic">Awaiting thoughts...</p>
              )}
            </div>
          </div>
        )}

        {/* Photo Gallery Section */}
        {activity.photos && activity.photos.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Image size={14} style={{ color: '#6F4E37' }} />
              <span className="text-xs font-semibold" style={{ color: '#6F4E37' }}>
                {activity.photos.length} {activity.photos.length === 1 ? 'Photo' : 'Photos'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {activity.photos.slice(0, 3).map((photo, index) => (
                <motion.button
                  key={index}
                  onClick={() => onViewPhotos && onViewPhotos(activity)}
                  className="relative aspect-square rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={photo}
                    alt={`${activity.name} photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 2 && activity.photos && activity.photos.length > 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        +{activity.photos.length - 3}
                      </span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Actions — refined buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E8D4D4]/60">
          {!activity.isCompleted ? (
            <motion.button
              onClick={() => onComplete(activity)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #6F4E37, #4A3428)' }}
              whileHover={{ scale: 1.01, boxShadow: '0 4px 14px rgba(74, 52, 40, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles size={15} />
              Mark Complete
            </motion.button>
          ) : (
            <>
              {!currentUserFeedback ? (
                <motion.button
                  onClick={() => onAddFeedback(activity)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #6F4E37, #4A3428)' }}
                  whileHover={{ scale: 1.01, boxShadow: '0 4px 14px rgba(74, 52, 40, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle size={15} />
                  Share Feedback
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => onAddFeedback(activity)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 border-[#6F4E37] text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle size={15} />
                  Edit Feedback
                </motion.button>
              )}
            </>
          )}

          {/* Edit — subtle icon button */}
          <motion.button
            onClick={() => onEdit(activity)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#B8A08A] hover:text-[#6F4E37] hover:bg-[#F5E6D3] transition-all"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            title="Edit activity"
          >
            <Pencil size={16} />
          </motion.button>

          {/* Delete — subtle icon button */}
          <motion.button
            onClick={() => onDelete(activity)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#B8A08A] hover:text-red-500 hover:bg-red-50 transition-all"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            title="Delete activity"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;

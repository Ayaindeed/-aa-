import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Image, X, Star, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import type { Activity } from '../types';

interface CalendarViewProps {
  activities: Activity[];
  onActivityClick: (activity: Activity) => void;
}

const CalendarView = ({ activities, onActivityClick }: CalendarViewProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  // Group completed activities by month
  const completedActivities = activities.filter(a => a.isCompleted && a.completedDate);
  
  const groupedByMonth = completedActivities.reduce((acc, activity) => {
    if (!activity.completedDate) return acc;
    
    const date = new Date(activity.completedDate);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(activity);
    
    return acc;
  }, {} as Record<string, Activity[]>);

  // Sort months (most recent first)
  const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => {
    const dateA = new Date(groupedByMonth[a][0].completedDate!);
    const dateB = new Date(groupedByMonth[b][0].completedDate!);
    return dateB.getTime() - dateA.getTime();
  });

  if (completedActivities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.1), rgba(111, 78, 55, 0.05))',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Calendar size={40} style={{ color: '#D4A574' }} />
        </motion.div>
        <h3 className="text-xl font-bold mb-2" style={{ color: '#2C1810' }}>
          No Dates Yet
        </h3>
        <p className="text-sm text-[#8B7355] text-center max-w-xs">
          Complete your first date to see it appear on your calendar!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pb-8">
      {/* Header */}
      <motion.div
        className="mb-8 text-center flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <Calendar size={28} style={{ color: '#6F4E37' }} />
          <h2 className="text-2xl font-bold" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
            Date Calendar
          </h2>
        </div>
        <p className="text-sm text-[#8B7355] text-center">
          {completedActivities.length} {completedActivities.length === 1 ? 'date' : 'dates'} completed
        </p>
      </motion.div>

      {/* Timeline by Month */}
      <div className="space-y-8 flex flex-col items-center w-full">
        {sortedMonths.map((monthYear, monthIndex) => (
          <motion.div
            key={monthYear}
            className="w-full max-w-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: monthIndex * 0.1 }}
          >
            {/* Month Header */}
            <div className="sticky top-0 z-10 backdrop-blur-sm pb-3 mb-4 flex justify-center">
              <motion.button
                onClick={() => setSelectedMonth(monthYear)}
                className="text-lg font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #F5E6D3, #E8D5C1)',
                  color: '#4A3428',
                  boxShadow: '0 2px 8px rgba(44, 24, 16, 0.1)',
                }}
                whileHover={{
                  boxShadow: '0 4px 12px rgba(44, 24, 16, 0.15)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                {monthYear}
              </motion.button>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4">
              {groupedByMonth[monthYear]
                .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime())
                .map((activity, index) => (
                  <motion.button
                    key={activity.id}
                    onClick={() => onActivityClick(activity)}
                    className="text-left relative overflow-hidden rounded-xl p-4"
                    style={{
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,230,211,0.85))',
                      boxShadow: '0 2px 12px rgba(44, 24, 16, 0.08)',
                      border: '1px solid rgba(212, 165, 116, 0.15)',
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: monthIndex * 0.1 + index * 0.05 }}
                    whileHover={{
                      y: -4,
                      boxShadow: '0 8px 24px rgba(44, 24, 16, 0.12)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Top accent */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ background: 'linear-gradient(90deg, #059669, #34d399)' }}
                    />

                    {/* Letter Badge */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #059669, #047857)',
                        }}
                      >
                        <span className="text-base font-bold text-white">
                          {activity.letter}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="font-bold text-sm truncate"
                          style={{ color: '#2C1810' }}
                        >
                          {activity.name}
                        </h4>
                        <p className="text-xs text-[#8B7355] mt-0.5">
                          {new Date(activity.completedDate!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-[#8B7355]">
                      {activity.feedbacks.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Heart size={12} fill="#D4A574" stroke="#D4A574" />
                          <span>{activity.feedbacks.length}</span>
                        </div>
                      )}
                      {activity.photos && activity.photos.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Image size={12} />
                          <span>{activity.photos.length}</span>
                        </div>
                      )}
                    </div>

                    {/* Photo Preview (if exists) */}
                    {activity.photos && activity.photos.length > 0 && (
                      <div className="mt-3 rounded-lg overflow-hidden">
                        <img
                          src={activity.photos[0]}
                          alt={activity.name}
                          className="w-full h-24 object-cover"
                        />
                      </div>
                    )}
                  </motion.button>
                ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Month Details Modal */}
      <AnimatePresence>
        {selectedMonth && !selectedActivity && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.6)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMonth(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(245,230,211,0.95))',
                boxShadow: '0 20px 60px rgba(44, 24, 16, 0.2)',
              }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={24} style={{ color: '#6F4E37' }} />
                  <h3 className="text-2xl font-bold" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
                    {selectedMonth}
                  </h3>
                </div>
                <motion.button
                  onClick={() => setSelectedMonth(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5E6D3] hover:bg-[#E8D5C1] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} style={{ color: '#6F4E37' }} />
                </motion.button>
              </div>

              {/* Activities List */}
              <div className="space-y-3">
                <p className="text-sm text-[#8B7355] mb-4">
                  {groupedByMonth[selectedMonth].length} {groupedByMonth[selectedMonth].length === 1 ? 'activity' : 'activities'} completed
                </p>
                {groupedByMonth[selectedMonth]
                  .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime())
                  .map((activity, index) => (
                    <motion.button
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity)}
                      className="w-full text-left p-4 rounded-xl transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(212, 165, 116, 0.2)',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: '0 4px 12px rgba(44, 24, 16, 0.1)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, #059669, #047857)',
                          }}
                        >
                          <span className="text-lg font-bold text-white">
                            {activity.letter}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base mb-1" style={{ color: '#2C1810' }}>
                            {activity.name}
                          </h4>
                          <p className="text-xs text-[#8B7355] mb-2">
                            {new Date(activity.completedDate!).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-[#8B7355]">
                            {activity.feedbacks.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Heart size={12} fill="#D4A574" stroke="#D4A574" />
                                <span>{activity.feedbacks.length} feedback{activity.feedbacks.length > 1 ? 's' : ''}</span>
                              </div>
                            )}
                            {activity.photos && activity.photos.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Image size={12} />
                                <span>{activity.photos.length} photo{activity.photos.length > 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity Details Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.6)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(245,230,211,0.95))',
                boxShadow: '0 20px 60px rgba(44, 24, 16, 0.2)',
              }}
            >
              {/* Back Button */}
              <motion.button
                onClick={() => setSelectedActivity(null)}
                className="mb-4 flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  color: '#6F4E37',
                  background: 'rgba(212, 165, 116, 0.1)',
                }}
                whileHover={{ background: 'rgba(212, 165, 116, 0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16} />
                <span>Back to {selectedMonth}</span>
              </motion.button>

              {/* Activity Header */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #059669, #047857)',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                  }}
                >
                  <span className="text-2xl font-bold text-white">
                    {selectedActivity.letter}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
                    {selectedActivity.name}
                  </h3>
                  <p className="text-sm text-[#8B7355]">
                    {new Date(selectedActivity.completedDate!).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Feedbacks */}
              {selectedActivity.feedbacks.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#6F4E37' }}>
                    <MessageCircle size={16} />
                    Feedback
                  </h4>
                  <div className="space-y-3">
                    {selectedActivity.feedbacks.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="p-4 rounded-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          border: '1px solid rgba(212, 165, 116, 0.2)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={feedback.user === 'AMR' ? '/p.png' : '/s.png'}
                            alt={feedback.user}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-bold text-sm" style={{ color: feedback.user === 'AMR' ? '#DC2626' : '#1a1a1a' }}>
                            {feedback.user}
                          </span>
                          <div className="flex gap-0.5 ml-auto">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < feedback.rating ? '#D4A574' : 'transparent'}
                                stroke={i < feedback.rating ? '#D4A574' : '#D1D5DB'}
                                strokeWidth={1.5}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-[#4A3428] italic leading-relaxed">
                          "{feedback.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos */}
              {selectedActivity.photos && selectedActivity.photos.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#6F4E37' }}>
                    <Image size={16} />
                    Photos ({selectedActivity.photos.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedActivity.photos.map((photo, index) => (
                      <motion.button
                        key={index}
                        onClick={() => onActivityClick(selectedActivity)}
                        className="relative aspect-square rounded-lg overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={photo}
                          alt={`${selectedActivity.name} photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;

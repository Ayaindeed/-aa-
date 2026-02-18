import { motion } from 'framer-motion';
import { Calendar, Heart, Image } from 'lucide-react';
import type { Activity } from '../types';

interface CalendarViewProps {
  activities: Activity[];
  onActivityClick: (activity: Activity) => void;
}

const CalendarView = ({ activities, onActivityClick }: CalendarViewProps) => {
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
    <div className="w-full max-w-4xl mx-auto px-4 pb-8">
      {/* Header */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 mb-2">
          <Calendar size={28} style={{ color: '#6F4E37' }} />
          <h2 className="text-2xl font-bold" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
            Date Calendar
          </h2>
        </div>
        <p className="text-sm text-[#8B7355]">
          {completedActivities.length} {completedActivities.length === 1 ? 'date' : 'dates'} completed
        </p>
      </motion.div>

      {/* Timeline by Month */}
      <div className="space-y-8">
        {sortedMonths.map((monthYear, monthIndex) => (
          <motion.div
            key={monthYear}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: monthIndex * 0.1 }}
          >
            {/* Month Header */}
            <div className="sticky top-0 z-10 backdrop-blur-sm pb-3 mb-4">
              <h3
                className="text-lg font-bold inline-block px-4 py-1.5 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #F5E6D3, #E8D5C1)',
                  color: '#4A3428',
                  boxShadow: '0 2px 8px rgba(44, 24, 16, 0.1)',
                }}
              >
                {monthYear}
              </h3>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
};

export default CalendarView;

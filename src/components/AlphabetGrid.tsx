import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import type { Activity } from '../types';

interface AlphabetGridProps {
  activities: Activity[];
  onLetterClick: (letter: string) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const AlphabetGrid = ({ activities, onLetterClick }: AlphabetGridProps) => {
  const getActivityForLetter = (letter: string) => {
    return activities.find(a => a.letter === letter);
  };

  const completedCount = activities.filter(a => a.isCompleted).length;
  const totalAssigned = activities.length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="cozy-card p-5 sm:p-8">
        {/* Progress Header */}
        <div className="mb-6 text-center">
          <h3
            className="text-lg sm:text-xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2C1810' }}
          >
            Your Alphabet Journey
          </h3>
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#8B7355] flex-wrap">
            <span>{completedCount} completed</span>
            <span className="text-[#D4A574]">·</span>
            <span>{totalAssigned} assigned</span>
            <span className="text-[#D4A574]">·</span>
            <span>{26 - totalAssigned} remaining</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full max-w-xs mx-auto h-2 bg-[#F5E6D3] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6F4E37, #D4A574)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / 26) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-[10px] sm:text-xs text-[#8B7355] mt-1.5">
            {Math.round((completedCount / 26) * 100)}% complete
          </p>
        </div>

        {/* Alphabet Grid — centered with consistent sizing */}
        <div className="flex justify-center">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2.5 sm:gap-3">
            {ALPHABET.map((letter, index) => {
              const activity = getActivityForLetter(letter);
              const hasActivity = !!activity;
              const isCompleted = activity?.isCompleted ?? false;

              return (
                <motion.button
                  key={letter}
                  onClick={() => onLetterClick(letter)}
                  className={`
                    relative w-[40px] h-[40px] sm:w-[46px] sm:h-[46px] rounded-xl flex items-center justify-center
                    font-bold text-sm sm:text-base transition-all
                    ${isCompleted
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-sm'
                      : hasActivity
                        ? 'bg-gradient-to-br from-[#D4A574] to-[#C8A96A] text-white shadow-sm'
                        : 'bg-white text-[#6F4E37] hover:bg-[#F5E6D3] border border-[#E8D4D4]'
                    }
                  `}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.015 }}
                  whileHover={{ scale: 1.12, zIndex: 10 }}
                  whileTap={{ scale: 0.93 }}
                >
                  {letter}

                  {/* Tiny status dot */}
                  {isCompleted && (
                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <CheckCircle size={10} className="text-emerald-500" />
                    </div>
                  )}
                  {hasActivity && !isCompleted && (
                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Clock size={10} className="text-[#D4A574]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-emerald-400 to-emerald-500" />
            <span className="text-[#8B7355]">Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-[#D4A574] to-[#C8A96A]" />
            <span className="text-[#8B7355]">Planned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-white border border-[#E8D4D4]" />
            <span className="text-[#8B7355]">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetGrid;

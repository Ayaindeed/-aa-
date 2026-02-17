import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Coffee, Heart } from 'lucide-react';
import { useState } from 'react';
import type { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

const Header = ({ currentUser, onLogout }: HeaderProps) => {
  const [showLoveAnimation, setShowLoveAnimation] = useState(false);
  const isAMR = currentUser === 'AMR';
  const userColor = isAMR ? '#DC2626' : '#1a1a1a';
  const userBgColor = isAMR ? 'rgba(220, 38, 38, 0.08)' : 'rgba(26, 26, 26, 0.06)';
  const userIcon = isAMR ? '/p.png' : '/s.png';

  const handleLogoClick = () => {
    if (showLoveAnimation) return;
    setShowLoveAnimation(true);
    setTimeout(() => setShowLoveAnimation(false), 2000);
  };

  return (
    <motion.header
      className="glass sticky top-0 z-30 px-4 pr-5 py-3 md:px-6"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo — with fancy animation */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleLogoClick}>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Coffee className="text-[#6F4E37]" size={24} />
            {/* Tiny pulse ring around coffee icon */}
            <motion.div
              className="absolute inset-0 rounded-full border border-[#D4A574]"
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ margin: -4 }}
            />
          </motion.div>

          {/* Animated —aa— / A♥A logo */}
          <motion.h1
            className="text-xl sm:text-2xl md:text-3xl font-bold relative overflow-hidden"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#2C1810',
              minWidth: '80px',
            }}
            whileHover={{ scale: 1.03 }}
          >
            <AnimatePresence mode="wait">
              {showLoveAnimation ? (
                <motion.span
                  key="love"
                  className="inline-flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.7, rotateX: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.7, rotateX: -90 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.span
                    style={{ color: '#DC2626' }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    A
                  </motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    <Heart size={18} className="text-[#DC2626]" fill="#DC2626" />
                  </motion.span>
                  <motion.span
                    style={{ color: '#1a1a1a' }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    A
                  </motion.span>
                </motion.span>
              ) : (
                <motion.span
                  key="logo"
                  className="relative inline-block"
                  initial={{ opacity: 0, scale: 0.7, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.7, rotateX: 90 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  —aa—
                  {/* Shimmer sweep */}
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(212,165,116,0.3) 50%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(90deg, transparent, black, transparent)',
                    }}
                    animate={{ x: ['-120%', '120%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.h1>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Current User Badge */}
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: userBgColor,
              border: `1.5px solid ${userColor}30`,
            }}
            whileHover={{ scale: 1.03 }}
          >
            <img
              src={userIcon}
              alt={isAMR ? 'Pisces' : 'Scorpio'}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span
              className="font-semibold text-sm"
              style={{ color: userColor }}
            >
              {currentUser}
            </span>
          </motion.div>

          {/* Switch User */}
          <motion.button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#8B7355] hover:bg-[#6F4E37]/8 transition-colors text-sm flex-shrink-0 mr-0.5"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            title="Switch User"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Switch</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

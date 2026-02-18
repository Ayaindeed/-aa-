import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Coffee, Heart, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

const Header = ({ currentUser, onLogout }: HeaderProps) => {
  const [showLoveAnimation, setShowLoveAnimation] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const isAMR = currentUser === 'AMR';
  const userColor = isAMR ? '#DC2626' : '#1a1a1a';
  const userBgColor = isAMR ? 'rgba(220, 38, 38, 0.08)' : 'rgba(26, 26, 26, 0.06)';
  const userIcon = isAMR ? '/p.png' : '/s.png';

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogoClick = () => {
    if (showLoveAnimation) return;
    setShowLoveAnimation(true);
    setTimeout(() => setShowLoveAnimation(false), 2000);
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const fezTime = formatTime(currentTime);
  const dublinTime = formatTime(currentTime);

  return (
    <motion.header
      className="glass sticky top-0 z-30 px-4 pr-5 py-3 md:px-6"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo — with fancy animation */}
        <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" onClick={handleLogoClick}>
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

        {/* Distance & Time Zones - Centered, Single Line (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <motion.div
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl relative"
            style={{
              background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.08), rgba(111, 78, 55, 0.06))',
              border: '1.5px solid rgba(212, 165, 116, 0.2)',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Fez */}
            <div className="flex items-center gap-1.5">
              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1.5px solid rgba(220, 38, 38, 0.3)',
                }}
                animate={{ 
                  scale: [1, 1.08, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <Heart size={11} className="text-[#DC2626]" fill="#DC2626" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider leading-none" style={{ color: '#DC2626' }}>
                  Fez
                </span>
                <span className="text-[11px] font-mono font-semibold text-[#4A3428] leading-none mt-0.5">
                  {fezTime}
                </span>
              </div>
            </div>

            {/* Elegant Curved Connection with Distance */}
            <div className="relative flex items-center justify-center px-2" style={{ width: '140px', height: '36px' }}>
              {/* SVG Curved Line with Gradient */}
              <svg 
                width="140" 
                height="36" 
                viewBox="0 0 140 36" 
                className="absolute top-0 left-0"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  {/* Gradient for the line */}
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#D4A574" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.3" />
                  </linearGradient>
                  
                  {/* Glow filter */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Background glow path */}
                <motion.path
                  d="M 10 20 Q 40 8, 70 18 Q 100 28, 130 20"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.2"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                />
                
                {/* Main curved dashed path */}
                <motion.path
                  d="M 10 20 Q 40 8, 70 18 Q 100 28, 130 20"
                  stroke="url(#lineGradient)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                />
                
                {/* Animated heart traveling along path */}
                <g filter="url(#glow)">
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.1, 0.9, 1]
                    }}
                  >
                    <animateMotion
                      dur="4s"
                      repeatCount="indefinite"
                      path="M 10 20 Q 40 8, 70 18 Q 100 28, 130 20"
                    />
                    <circle r="2.5" fill="#D4A574" opacity="0.8" />
                    <circle r="1.5" fill="#FFFFFF" />
                  </motion.g>
                </g>

                {/* Sparkle effect at midpoint */}
                <motion.circle
                  cx="70"
                  cy="18"
                  r="2"
                  fill="#D4A574"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 0],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    delay: 1
                  }}
                />
              </svg>
              
              {/* Floating Distance Badge */}
              <motion.div
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg relative z-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(245, 230, 211, 0.95))',
                  border: '1px solid rgba(212, 165, 116, 0.3)',
                  boxShadow: '0 2px 8px rgba(111, 78, 55, 0.15), 0 1px 2px rgba(111, 78, 55, 0.1)',
                }}
                initial={{ opacity: 0, y: -5, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  y: [-1, 1, -1],
                  scale: 1
                }}
                transition={{ 
                  opacity: { delay: 0.7, duration: 0.3 },
                  scale: { delay: 0.7, duration: 0.3 },
                  y: { delay: 1, duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  <MapPin size={10} className="text-[#6F4E37]" />
                </motion.div>
                <span className="text-[10px] font-bold bg-gradient-to-r from-[#DC2626] via-[#D4A574] to-[#1a1a1a] bg-clip-text text-transparent">
                  2,147 km
                </span>
              </motion.div>
            </div>

            {/* Dublin */}
            <div className="flex items-center gap-1.5">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider leading-none text-right" style={{ color: '#1a1a1a' }}>
                  Dublin
                </span>
                <span className="text-[11px] font-mono font-semibold text-[#4A3428] leading-none mt-0.5 text-right">
                  {dublinTime}
                </span>
              </div>
              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(26, 26, 26, 0.08)',
                  border: '1.5px solid rgba(26, 26, 26, 0.2)',
                }}
                animate={{ 
                  scale: [1, 1.08, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: 0.5
                }}
              >
                <Heart size={11} className="text-[#1a1a1a]" fill="#1a1a1a" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* User Info & Logout - Aligned Right */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#8B7355] hover:bg-[#6F4E37]/8 transition-colors text-sm"
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

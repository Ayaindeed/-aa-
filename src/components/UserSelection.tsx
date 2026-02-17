import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Heart, Sparkles, Star } from 'lucide-react';
import { useState, useCallback } from 'react';
import type { User } from '../types';

interface UserSelectionProps {
  onSelect: (user: User) => void;
}

const users = [
  {
    id: 'AMR' as User,
    name: 'AMR',
    zodiac: 'Pisces',
    icon: '/p.png',
    color: '#DC2626',
    softColor: 'rgba(220, 38, 38, 0.12)',
    glowColor: 'rgba(220, 38, 38, 0.3)',
  },
  {
    id: 'ASEI' as User,
    name: 'ASEI',
    zodiac: 'Scorpio',
    icon: '/s.png',
    color: '#1a1a1a',
    softColor: 'rgba(26, 26, 26, 0.08)',
    glowColor: 'rgba(26, 26, 26, 0.2)',
  },
];

// Burst particles for the selection animation
const burstParticles = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const radius = 120 + Math.random() * 80;
  return {
    id: i,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    size: 6 + Math.random() * 10,
    delay: Math.random() * 0.15,
    type: (['heart', 'sparkle', 'star'] as const)[i % 3],
  };
});

const UserSelection = ({ onSelect }: UserSelectionProps) => {
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = useCallback((user: typeof users[0]) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedUser(user);
    // After the celebration animation, proceed
    setTimeout(() => onSelect(user.id), 1400);
  }, [isAnimating, onSelect]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FDF8F3 0%, #F5E6D3 40%, #E8D4D4 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
          style={{ background: 'rgba(220,38,38,0.04)' }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full"
          style={{ background: 'rgba(26,26,26,0.04)' }}
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.03), transparent)' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Selection celebration overlay */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Colored background wash */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: `radial-gradient(circle at center, ${selectedUser.color}12 0%, ${selectedUser.color}08 50%, transparent 80%)`,
              }}
            />

            {/* Burst particles */}
            {burstParticles.map(p => (
              <motion.div
                key={p.id}
                className="absolute"
                style={{ left: '50%', top: '50%' }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                }}
                transition={{
                  duration: 1,
                  delay: 0.2 + p.delay,
                  ease: 'easeOut',
                }}
              >
                {p.type === 'heart' && (
                  <Heart size={p.size} color={selectedUser.color} fill={selectedUser.color} opacity={0.6} />
                )}
                {p.type === 'sparkle' && (
                  <Sparkles size={p.size} color="#D4A574" opacity={0.7} />
                )}
                {p.type === 'star' && (
                  <Star size={p.size} color={selectedUser.color} fill={selectedUser.color} opacity={0.5} />
                )}
              </motion.div>
            ))}

            {/* Central selected user card — zoomed in */}
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              {/* Pulsing ring */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 180,
                  height: 180,
                  border: `3px solid ${selectedUser.color}`,
                }}
                animate={{
                  scale: [1, 1.6, 2],
                  opacity: [0.5, 0.15, 0],
                }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 180,
                  height: 180,
                  border: `2px solid ${selectedUser.color}`,
                }}
                animate={{
                  scale: [1, 1.3, 1.7],
                  opacity: [0.4, 0.1, 0],
                }}
                transition={{ duration: 1, delay: 0.15, ease: 'easeOut' }}
              />

              {/* Zodiac image */}
              <motion.div
                className="w-32 h-32 rounded-full flex items-center justify-center mb-5 shadow-2xl"
                style={{
                  background: selectedUser.softColor,
                  border: `3px solid ${selectedUser.color}40`,
                }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <img
                  src={selectedUser.icon}
                  alt={selectedUser.zodiac}
                  className="w-20 h-20 object-contain"
                />
              </motion.div>

              <motion.h2
                className="text-3xl font-bold mb-1"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: selectedUser.color,
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {selectedUser.name}
              </motion.h2>
              <motion.p
                className="text-base font-medium"
                style={{ color: '#8B7355' }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                Let's brew something special
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo Section */}
      <motion.div
        className="text-center mb-10 sm:mb-14 relative z-10"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 80 }}
      >
        {/* Coffee icon with pulse */}
        <motion.div
          className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(111, 78, 55, 0.1)' }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Coffee className="text-[#6F4E37]" size={22} />
        </motion.div>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 relative overflow-hidden"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#2C1810',
            letterSpacing: '-0.02em',
          }}
        >
          <span className="relative inline-block">
            {'—aa—'.split('').map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 30, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 100 }}
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(212,165,116,0.35) 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(90deg, transparent, black, transparent)',
              }}
              animate={{ x: ['-120%', '120%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            />
          </span>
        </h1>
        <p
          className="text-lg sm:text-xl font-medium"
          style={{ fontFamily: "'Quicksand', sans-serif", color: '#6F4E37' }}
        >
          Who's brewing today?
        </p>
      </motion.div>

      {/* User Cards */}
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 md:gap-8 relative z-10 w-full max-w-md sm:max-w-none justify-center items-center px-4">
        {users.map((user, index) => (
          <motion.button
            key={user.id}
            onClick={() => handleSelect(user)}
            disabled={isAnimating}
            className="relative overflow-hidden rounded-2xl flex items-center gap-4 w-full sm:w-auto cursor-pointer group"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 4px 24px rgba(44, 24, 16, 0.06), 0 1px 3px rgba(44, 24, 16, 0.04)',
              border: '1.5px solid rgba(212, 165, 116, 0.15)',
              padding: '16px 20px',
            }}
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + index * 0.15, type: 'spring', stiffness: 80 }}
            whileHover={{
              y: -4,
              scale: 1.02,
              boxShadow: `0 16px 40px ${user.glowColor}, 0 2px 6px rgba(44, 24, 16, 0.06)`,
              borderColor: `${user.color}30`,
            }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Left accent stripe */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              style={{ background: `linear-gradient(180deg, ${user.color}, ${user.color}88)` }}
            />

            {/* Zodiac Icon — small inline */}
            <motion.div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${user.softColor}, rgba(255,255,255,0.8))`,
                border: `1.5px solid ${user.color}18`,
              }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={user.icon}
                alt={user.zodiac}
                className="w-9 h-9 object-contain"
              />
            </motion.div>

            {/* Name & Zodiac */}
            <div className="flex flex-col items-start flex-1 min-w-0">
              <h2
                className="text-xl sm:text-2xl font-bold leading-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: user.color,
                }}
              >
                {user.name}
              </h2>
              <p
                className="text-[10px] font-medium tracking-wider uppercase mt-0.5"
                style={{ color: '#8B7355', letterSpacing: '0.12em' }}
              >
                {user.zodiac}
              </p>
            </div>

            {/* Brew button */}
            <motion.div
              className="px-4 py-2 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 uppercase flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${user.color}, ${user.color}DD)`,
                color: '#fff',
                boxShadow: `0 4px 12px ${user.color}20`,
                letterSpacing: '0.06em',
              }}
            >
              <Coffee size={13} strokeWidth={2.5} />
              <span>Brew</span>
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Subtle bottom decoration */}
      <motion.div
        className="mt-10 sm:mt-14 flex items-center gap-3 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <img src="/p.png" alt="Pisces" className="w-4 h-4 rounded-full object-cover opacity-40" />
        <span className="text-xs tracking-wider" style={{ color: '#B8A08A' }}>
          Pisces × Scorpio
        </span>
        <img src="/s.png" alt="Scorpio" className="w-4 h-4 rounded-full object-cover opacity-40" />
      </motion.div>
    </motion.div>
  );
};

export default UserSelection;

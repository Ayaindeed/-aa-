import { motion } from 'framer-motion';
import { useEffect, useState, useRef, useMemo } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface CoffeeLoadingProps {
  onComplete: () => void;
}

interface FloatingParticle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  type: 'heart' | 'sparkle' | 'dot';
}

const CoffeeLoading = ({ onComplete }: CoffeeLoadingProps) => {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onCompleteRef.current(), 500);
          return 100;
        }
        return prev + 1.2;
      });
    }, 35);
    return () => clearInterval(interval);
  }, []);

  const particles: FloatingParticle[] = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      size: 10 + Math.random() * 14,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 4,
      drift: -25 + Math.random() * 50,
      type: (['heart', 'sparkle', 'dot'] as const)[i % 3],
    }));
  }, []);

  const loadingMessages = [
    'Brewing your experience...',
    'Warming up the cups...',
    'Adding a dash of love...',
    'Stirring in some magic...',
    'Almost ready...',
  ];
  const messageIndex = Math.min(Math.floor(progress / 22), loadingMessages.length - 1);

  const fillY = 46 + (1 - Math.min(progress / 100, 1)) * 92;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FDF8F3 0%, #F5E6D3 40%, #E8D4D4 100%)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5 }}
    >
      {/* Soft animated bg circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[8%] right-[5%] w-52 h-52 rounded-full"
          style={{ background: 'rgba(212,165,116,0.04)' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[12%] left-[6%] w-64 h-64 rounded-full"
          style={{ background: 'rgba(232,212,212,0.06)' }}
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full"
          style={{ background: 'rgba(212,165,116,0.02)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.02, 0.04, 0.02] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Floating particles — hearts, sparkles, dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{ left: `${p.x}%`, bottom: '-5%' }}
            animate={{
              y: [0, -800],
              x: [0, p.drift],
              opacity: [0, 0.55, 0.35, 0],
              rotate: [0, p.drift > 0 ? 25 : -25],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          >
            {p.type === 'heart' && (
              <Heart size={p.size} color="rgba(220,38,38,0.35)" fill="rgba(220,38,38,0.2)" />
            )}
            {p.type === 'sparkle' && (
              <Sparkles size={p.size} color="rgba(212,165,116,0.45)" />
            )}
            {p.type === 'dot' && (
              <div
                className="rounded-full"
                style={{
                  width: p.size * 0.5,
                  height: p.size * 0.5,
                  background: 'rgba(111, 78, 55, 0.18)',
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Coffee Cup — clean, beautiful illustration */}
        <div className="relative mb-8">
          {/* Steam — elegant rising wisps */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="relative"
                animate={{
                  y: [0, -30, -60],
                  opacity: [0, 0.55, 0],
                  scaleX: [0.8, 1.3, 2],
                }}
                transition={{
                  duration: 2.5 + i * 0.4,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              >
                <svg width={14 + i * 4} height="40" viewBox="0 0 20 40" fill="none">
                  <path
                    d={i === 1
                      ? 'M10 40 Q6 28 12 20 Q18 12 8 0'
                      : 'M10 40 Q14 28 8 20 Q2 12 12 0'
                    }
                    stroke="rgba(111, 78, 55, 0.12)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </motion.div>
            ))}
          </div>

          {/* Main cup SVG */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            <svg width="180" height="160" viewBox="0 0 180 160" fill="none">
              {/* Saucer shadow */}
              <ellipse cx="82" cy="152" rx="75" ry="7" fill="#D4A574" opacity="0.12" />
              {/* Saucer */}
              <ellipse cx="82" cy="148" rx="78" ry="10" fill="#F0E0D0" />
              <ellipse cx="82" cy="146" rx="70" ry="8" fill="#FDF8F3" stroke="#D4A574" strokeWidth="1" />

              {/* Cup body */}
              <path
                d="M24 42 L32 128 Q32 138 48 138 L116 138 Q132 138 132 128 L140 42 Z"
                fill="url(#cupFill)"
                stroke="#C09B70"
                strokeWidth="2"
              />

              {/* Coffee inside */}
              <clipPath id="coffeeMask">
                <path d="M28 46 L34 126 Q34 134 48 134 L116 134 Q130 134 130 126 L136 46 Z" />
              </clipPath>

              <motion.rect
                x="24"
                y={fillY}
                width="120"
                height="92"
                fill="url(#coffeeLiquid)"
                clipPath="url(#coffeeMask)"
                animate={{ y: fillY }}
                transition={{ duration: 0.2 }}
              />

              {/* Latte art heart — appears when > 60% */}
              {progress > 60 && (
                <motion.g clipPath="url(#coffeeMask)">
                  <motion.path
                    d="M72 75 Q72 67 78 67 Q82 67 82 72 Q82 67 86 67 Q92 67 92 75 Q92 82 82 90 Q72 82 72 75 Z"
                    fill="#EADCC8"
                    opacity="0.5"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{ transformOrigin: '82px 78px' }}
                  />
                </motion.g>
              )}

              {/* Coffee surface shimmer */}
              {progress > 25 && (
                <motion.ellipse
                  cx="82"
                  rx="46"
                  ry="3"
                  fill="#A07840"
                  opacity="0.15"
                  clipPath="url(#coffeeMask)"
                  animate={{
                    cy: [fillY, fillY - 2],
                    opacity: [0.12, 0.2, 0.12],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}

              {/* Cup rim */}
              <path
                d="M26 42 Q26 36 34 36 L130 36 Q138 36 138 42"
                stroke="#C09B70"
                strokeWidth="2.5"
                fill="#FDF8F3"
              />
              <path d="M32 40 L132 40" stroke="#D4A574" strokeWidth="1" opacity="0.4" />

              {/* Handle */}
              <path
                d="M140 55 Q170 55 170 85 Q170 115 140 115"
                stroke="#C09B70"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M140 62 Q162 62 162 85 Q162 108 140 108"
                stroke="#D4A574"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.35"
              />

              <defs>
                <linearGradient id="cupFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="60%" stopColor="#FDF8F3" />
                  <stop offset="100%" stopColor="#F0E0D0" />
                </linearGradient>
                <linearGradient id="coffeeLiquid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A07840" />
                  <stop offset="40%" stopColor="#7A5C38" />
                  <stop offset="100%" stopColor="#4A3420" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Animated glow ring behind cup */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: 200,
              height: 200,
              border: '2px solid rgba(212, 165, 116, 0.1)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Logo */}
        <motion.div
          className="relative mb-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold relative"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#2C1810',
              letterSpacing: '-0.02em',
            }}
          >
            <span className="relative inline-block">
              —aa—
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(212,165,116,0.3) 50%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(90deg, transparent, black, transparent)',
                }}
                animate={{ x: ['-120%', '120%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
              />
            </span>
          </h1>
        </motion.div>

        <motion.p
          className="text-sm sm:text-base mb-8 text-center tracking-wide"
          style={{ color: '#8B7355' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Alphabet Dating for Two
        </motion.p>

        {/* Progress bar */}
        <div
          className="w-56 sm:w-64 h-2.5 rounded-full overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.4)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid rgba(212,165,116,0.2)',
          }}
        >
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: 'linear-gradient(90deg, #6F4E37, #D4A574, #C8A96A)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </div>

        <motion.p
          className="mt-3 text-xs h-4"
          style={{ color: '#8B7355' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          key={messageIndex}
        >
          {progress < 100 ? loadingMessages[messageIndex] : 'Ready!'}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default CoffeeLoading;

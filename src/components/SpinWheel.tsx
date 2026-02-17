import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';

interface SpinWheelProps {
  onLetterSelected: (letter: string) => void;
  usedLetters: string[];
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const SEGMENT_ANGLE = 360 / 26;

const SpinWheel = ({ onLetterSelected, usedLetters }: SpinWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const availableLetters = ALPHABET.filter(l => !usedLetters.includes(l));

  const spin = useCallback(() => {
    if (isSpinning || availableLetters.length === 0) return;

    setIsSpinning(true);
    setSelectedLetter(null);

    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    const letter = availableLetters[randomIndex];
    const letterIndex = ALPHABET.indexOf(letter);

    const baseSpins = 5 + Math.floor(Math.random() * 3);
    const letterAngle = letterIndex * SEGMENT_ANGLE;
    const targetRotation = baseSpins * 360 + (360 - letterAngle);

    setRotation(prev => prev + targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedLetter(letter);
    }, 4000);
  }, [isSpinning, availableLetters]);

  const handleConfirm = () => {
    if (selectedLetter) {
      onLetterSelected(selectedLetter);
      setSelectedLetter(null);
    }
  };

  const handleManualSelect = (letter: string) => {
    if (!isSpinning && !usedLetters.includes(letter)) {
      setSelectedLetter(letter);
    }
  };

  // Wheel size responsive
  const wheelSize = { base: 290, sm: 340, md: 380 };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Wheel Container — perfectly centered */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Pointer Arrow — top center of wheel */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
          <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
            <path d="M12 30 L0 0 L24 0 Z" fill="#2C1810" />
            <path d="M12 26 L3 2 L21 2 Z" fill="#4A3428" />
          </svg>
        </div>

        {/* Outer glow ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: wheelSize.base + 16,
            height: wheelSize.base + 16,
            boxShadow: '0 12px 50px rgba(111, 78, 55, 0.2), 0 0 0 2px rgba(111, 78, 55, 0.1)',
          }}
        />

        {/* The Wheel */}
        <motion.div
          className="rounded-full relative"
          style={{
            width: wheelSize.base,
            height: wheelSize.base,
            background: '#F5E6D3',
            border: '5px solid #4A3428',
            boxShadow: 'inset 0 0 30px rgba(111, 78, 55, 0.1), 0 8px 30px rgba(44, 24, 16, 0.15)',
          }}
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.15, 0.85, 0.15, 1] }}
        >
          {/* Segment dividers using SVG */}
          <svg
            className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
            viewBox="0 0 300 300"
          >
            {ALPHABET.map((_, i) => {
              const angle = (i * SEGMENT_ANGLE * Math.PI) / 180 - Math.PI / 2;
              const x2 = 150 + 145 * Math.cos(angle);
              const y2 = 150 + 145 * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1="150"
                  y1="150"
                  x2={x2}
                  y2={y2}
                  stroke="#D4A57430"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>

          {/* Letters around the wheel */}
          {ALPHABET.map((letter, index) => {
            const midAngle = index * SEGMENT_ANGLE;
            const isUsed = usedLetters.includes(letter);
            const r = (wheelSize.base / 2) - 32;

            return (
              <button
                key={letter}
                className={`absolute font-bold transition-all duration-200 ${
                  isUsed
                    ? 'opacity-20 cursor-default'
                    : 'hover:scale-[1.3] cursor-pointer'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${midAngle}deg) translateY(-${r}px) rotate(-${midAngle}deg)`,
                  color: isUsed ? '#BBB' : '#2C1810',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '15px',
                  textDecoration: isUsed ? 'line-through' : 'none',
                  lineHeight: 1,
                }}
                onClick={() => handleManualSelect(letter)}
                disabled={isUsed || isSpinning}
              >
                {letter}
              </button>
            );
          })}

          {/* Center Spin Button */}
          <motion.button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer z-10"
            style={{
              width: 80,
              height: 80,
              background: 'linear-gradient(145deg, #6F4E37, #3D2817)',
              boxShadow: '0 6px 20px rgba(44, 24, 16, 0.4), inset 0 1px 3px rgba(255,255,255,0.1)',
              border: '3px solid #2C1810',
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={spin}
            disabled={isSpinning || availableLetters.length === 0}
          >
            <span
              className="text-sm font-bold select-none"
              style={{ color: '#FDF8F3', letterSpacing: '0.05em' }}
            >
              {isSpinning ? '...' : 'SPIN'}
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {selectedLetter && !isSpinning && (
          <motion.div
            className="text-center w-full max-w-sm mx-auto px-4"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <motion.div
              className="text-6xl sm:text-7xl font-bold mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#2C1810',
              }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {selectedLetter}
            </motion.div>
            <p className="text-sm text-[#8B7355] mb-5">
              Your letter is <span className="font-bold text-[#4A3428]">{selectedLetter}</span>
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={spin} className="btn-secondary text-sm">
                Spin Again
              </button>
              <button onClick={handleConfirm} className="btn-primary text-sm">
                Choose Letter
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letters remaining */}
      <p className="mt-5 text-xs text-[#8B7355]">
        {availableLetters.length} of 26 letters remaining
      </p>
      {availableLetters.length === 0 && (
        <p className="text-[#DC2626] font-medium text-sm mt-1">
          All letters completed! Amazing journey!
        </p>
      )}
    </div>
  );
};

export default SpinWheel;

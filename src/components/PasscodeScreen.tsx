import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { Lock, Delete, ShieldCheck } from 'lucide-react';

interface PasscodeScreenProps {
  onSuccess: () => void;
}

const CORRECT_CODE = '1423';

const PasscodeScreen = ({ onSuccess }: PasscodeScreenProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDigit = useCallback((digit: string) => {
    if (success) return;
    setError(false);

    const newCode = code + digit;
    if (newCode.length <= 4) {
      setCode(newCode);

      if (newCode.length === 4) {
        if (newCode === CORRECT_CODE) {
          setSuccess(true);
          setTimeout(() => onSuccess(), 800);
        } else {
          setError(true);
          setTimeout(() => {
            setCode('');
            setError(false);
          }, 600);
        }
      }
    }
  }, [code, success, onSuccess]);

  const handleDelete = useCallback(() => {
    if (success) return;
    setCode(prev => prev.slice(0, -1));
    setError(false);
  }, [success]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDelete]);

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FDF8F3 0%, #F5E6D3 40%, #E8D4D4 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle bg elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[15%] right-[10%] w-48 h-48 rounded-full bg-[#D4A574]/[0.04]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[8%] w-56 h-56 rounded-full bg-[#E8D4D4]/[0.06]"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-xs">
        {/* Lock icon */}
        <motion.div
          className="mb-6 w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: success
              ? 'linear-gradient(135deg, #059669, #047857)'
              : 'linear-gradient(135deg, #6F4E37, #4A3428)',
            boxShadow: success
              ? '0 8px 30px rgba(5, 150, 105, 0.3)'
              : '0 8px 30px rgba(74, 52, 40, 0.25)',
          }}
          animate={error ? { x: [-12, 12, -8, 8, -4, 4, 0] } : success ? { scale: [1, 1.15, 1] } : {}}
          transition={error ? { duration: 0.5 } : { duration: 0.6 }}
        >
          {success ? (
            <ShieldCheck className="text-white" size={28} />
          ) : (
            <Lock className="text-white" size={24} />
          )}
        </motion.div>

        {/* Title */}
        <h1
          className="text-2xl sm:text-3xl font-bold mb-2 text-center"
          style={{ fontFamily: "'Playfair Display', serif", color: '#2C1810' }}
        >
          —aa—
        </h1>
        <p className="text-sm text-[#8B7355] mb-8 text-center">
          {success ? 'Welcome back!' : 'Enter your secret code'}
        </p>

        {/* Dots */}
        <div className="flex gap-4 mb-10">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="w-4 h-4 rounded-full border-2 transition-all duration-200"
              style={{
                borderColor: error ? '#DC2626' : success ? '#059669' : code.length > i ? '#4A3428' : '#D4A574',
                background: code.length > i
                  ? error ? '#DC2626' : success ? '#059669' : '#4A3428'
                  : 'transparent',
              }}
              animate={
                code.length > i
                  ? { scale: [0.8, 1.2, 1] }
                  : {}
              }
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
          {digits.map((digit, i) => {
            if (digit === '') {
              return <div key={i} />;
            }
            if (digit === 'del') {
              return (
                <motion.button
                  key={i}
                  onClick={handleDelete}
                  className="w-full aspect-square rounded-2xl flex items-center justify-center text-[#8B7355] hover:bg-[#6F4E37]/8 transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <Delete size={22} />
                </motion.button>
              );
            }
            return (
              <motion.button
                key={i}
                onClick={() => handleDigit(digit)}
                className="w-full aspect-square rounded-2xl flex items-center justify-center text-xl font-semibold transition-all"
                style={{
                  color: '#2C1810',
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(212, 165, 116, 0.2)',
                  fontFamily: "'Quicksand', sans-serif",
                }}
                whileHover={{
                  background: 'rgba(212, 165, 116, 0.15)',
                  borderColor: 'rgba(212, 165, 116, 0.4)',
                }}
                whileTap={{ scale: 0.92, background: 'rgba(212, 165, 116, 0.25)' }}
              >
                {digit}
              </motion.button>
            );
          })}
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="mt-5 text-sm text-[#DC2626] font-medium"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Wrong code, try again
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PasscodeScreen;

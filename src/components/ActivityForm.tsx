import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { activitySuggestions } from '../types';

interface ActivityFormProps {
  isOpen: boolean;
  letter: string;
  onClose: () => void;
  onSave: (name: string) => void;
  initialValue?: string;
  isEdit?: boolean;
}

const ActivityForm = ({ isOpen, letter, onClose, onSave, initialValue = '', isEdit = false }: ActivityFormProps) => {
  const [activityName, setActivityName] = useState(initialValue);
  const suggestions = activitySuggestions[letter] || [];

  // Reset form when opening with new initialValue
  React.useEffect(() => {
    if (isOpen) {
      setActivityName(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activityName.trim()) {
      onSave(activityName.trim());
      setActivityName('');
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setActivityName(suggestion);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(44, 24, 16, 0.4)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[400px] px-4"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 24px 60px rgba(44, 24, 16, 0.18)',
                border: '1.5px solid rgba(212, 165, 116, 0.12)',
              }}
            >
              {/* Top accent bar */}
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #D4A574, #C8A96A, #6F4E37)' }} />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-[#B8A08A] hover:text-[#4A3428] hover:bg-[#F5E6D3] transition-all z-10"
              >
                <X size={16} />
              </button>

              <div className="px-6 pt-5 pb-6">
                {/* Header — centered letter + title stacked */}
                <div className="text-center mb-5 pr-4">
                  <motion.div
                    className="w-11 h-11 rounded-lg flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #D4A574, #C8A96A)',
                      boxShadow: '0 3px 10px rgba(212, 165, 116, 0.25)',
                    }}
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <span
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {letter}
                    </span>
                  </motion.div>
                  <h2
                    className="text-lg font-bold leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#2C1810' }}
                  >
                    {isEdit ? 'Edit Activity' : `Activity for "${letter}"`}
                  </h2>
                  <p className="text-xs mt-1" style={{ color: '#8B7355' }}>
                    {isEdit ? 'Update the activity name' : `What adventure starts with ${letter}?`}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={activityName}
                      onChange={e => setActivityName(e.target.value)}
                      placeholder={`Enter an activity starting with ${letter}...`}
                      className="w-full text-sm px-4 py-3 rounded-xl outline-none"
                      style={{
                        background: 'rgba(245, 230, 211, 0.35)',
                        border: '1.5px solid rgba(212, 165, 116, 0.25)',
                        color: '#2C1810',
                      }}
                      autoFocus
                    />
                  </div>

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="mb-5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles size={13} className="text-[#D4A574]" />
                        <span className="text-[11px] font-semibold text-[#8B7355] uppercase tracking-wider">Suggestions</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {suggestions.map(suggestion => (
                          <motion.button
                            key={suggestion}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 text-xs rounded-lg transition-all font-medium"
                            style={{
                              background: activityName === suggestion
                                ? 'linear-gradient(135deg, #4A3428, #6F4E37)'
                                : 'rgba(245, 230, 211, 0.5)',
                              color: activityName === suggestion ? '#FFFFFF' : '#6F4E37',
                              border: activityName === suggestion
                                ? 'none'
                                : '1px solid rgba(212, 165, 116, 0.2)',
                            }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 justify-end pt-1">
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold"
                      style={{
                        background: 'rgba(111, 78, 55, 0.08)',
                        color: '#6F4E37',
                        border: '1px solid rgba(111, 78, 55, 0.12)',
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={!activityName.trim()}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg, #6F4E37, #4A3428)',
                        boxShadow: '0 3px 12px rgba(74, 52, 40, 0.2)',
                      }}
                      whileHover={activityName.trim() ? { scale: 1.03 } : {}}
                      whileTap={activityName.trim() ? { scale: 0.97 } : {}}
                    >
                      {isEdit ? 'Save Changes' : 'Add Activity'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActivityForm;

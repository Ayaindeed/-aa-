import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PasscodeScreen from './components/PasscodeScreen';
import CoffeeLoading from './components/CoffeeLoading';
import UserSelection from './components/UserSelection';
import Header from './components/Header';
import SpinWheel from './components/SpinWheel';
import AlphabetGrid from './components/AlphabetGrid';
import ActivityCard from './components/ActivityCard';
import ActivityForm from './components/ActivityForm';
import FeedbackModal from './components/FeedbackModal';
import {
  getActivities,
  saveActivity,
  deleteActivity,
  saveFeedback,
} from './lib/supabase';
import type { Activity, Feedback, User } from './types';
import { Heart, Dices, LayoutGrid, ClipboardList, Coffee, ArrowRightLeft, Flame, Clapperboard, Car, SmilePlus, Trash2 } from 'lucide-react';
import './index.css';

type View = 'spin' | 'grid' | 'activities';

// Funny romantic messages for the switch popup
const switchMessages = [
  { text: "Leaving so soon?", sub: "Don't worry, your partner will take good care of things...", icon: SmilePlus },
  { text: "Switching sides?", sub: "Remember, love isn't a competition... or is it?", icon: Heart },
  { text: "Tag team!", sub: "One down, one to go. The alphabet waits for no one!", icon: ArrowRightLeft },
  { text: "Passing the torch", sub: "Let's see who plans the better date this time!", icon: Flame },
  { text: "Plot twist!", sub: "The other half enters the chat...", icon: Clapperboard },
  { text: "Switching drivers!", sub: "Hope the other one doesn't crash our date plans!", icon: Car },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentView, setCurrentView] = useState<View>('spin');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [feedbackActivity, setFeedbackActivity] = useState<Activity | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);
  const [showSwitchPopup, setShowSwitchPopup] = useState(false);
  const [switchMessage] = useState(() => switchMessages[Math.floor(Math.random() * switchMessages.length)]);

  // No caching — always ask "Who's brewing today?" on every visit

  // Load activities when user is set
  useEffect(() => {
    if (currentUser) {
      loadActivities();
    }
  }, [currentUser]);

  const loadActivities = async () => {
    const data = await getActivities();
    setActivities(data);
  };

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleUserSelect = (user: User) => {
    setCurrentUserState(user);
  };

  const handleLogout = () => {
    setShowSwitchPopup(true);
  };

  const handleConfirmSwitch = () => {
    setShowSwitchPopup(false);
    setCurrentUserState(null);
  };

  const handleLetterSelected = (letter: string) => {
    setSelectedLetter(letter);
    setShowActivityForm(true);
  };

  const handleLetterClick = (letter: string) => {
    const existing = activities.find(a => a.letter === letter);
    if (existing) {
      // Show activity details - switch to activities view
      setCurrentView('activities');
    } else {
      // Create new activity
      setSelectedLetter(letter);
      setShowActivityForm(true);
    }
  };

  const handleCreateActivity = async (name: string) => {
    if (!selectedLetter) return;

    const newActivity: Activity = {
      id: crypto.randomUUID(),
      letter: selectedLetter,
      name,
      isCompleted: false,
      feedbacks: [],
      createdAt: new Date().toISOString(),
    };

    await saveActivity(newActivity);
    await loadActivities();
    setShowActivityForm(false);
    setSelectedLetter(null);
  };

  const handleCompleteActivity = async (activity: Activity) => {
    const updated: Activity = {
      ...activity,
      isCompleted: true,
      completedDate: new Date().toISOString(),
    };

    await saveActivity(updated);
    await loadActivities();
  };

  const handleDeleteActivity = async (activity: Activity) => {
    setDeletingActivity(activity);
  };

  const handleConfirmDelete = async () => {
    if (!deletingActivity) return;
    await deleteActivity(deletingActivity.id);
    await loadActivities();
    setDeletingActivity(null);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setSelectedLetter(activity.letter);
    setShowActivityForm(true);
  };

  const handleUpdateActivity = async (name: string) => {
    if (!editingActivity) return;

    const updatedActivity: Activity = {
      ...editingActivity,
      name,
    };

    await saveActivity(updatedActivity);
    await loadActivities();
    setShowActivityForm(false);
    setSelectedLetter(null);
    setEditingActivity(null);
  };

  const handleAddFeedback = (activity: Activity) => {
    setFeedbackActivity(activity);
  };

  const handleSaveFeedback = async (feedbackData: Omit<Feedback, 'id' | 'createdAt'>) => {
    if (!feedbackActivity) return;

    const newFeedback: Feedback = {
      ...feedbackData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    await saveFeedback(newFeedback);

    // Update activity with new feedback
    const existingFeedbackIndex = feedbackActivity.feedbacks.findIndex(
      f => f.user === feedbackData.user
    );

    let updatedFeedbacks: Feedback[];
    if (existingFeedbackIndex >= 0) {
      updatedFeedbacks = [...feedbackActivity.feedbacks];
      updatedFeedbacks[existingFeedbackIndex] = newFeedback;
    } else {
      updatedFeedbacks = [...feedbackActivity.feedbacks, newFeedback];
    }

    const updatedActivity: Activity = {
      ...feedbackActivity,
      feedbacks: updatedFeedbacks,
    };

    await saveActivity(updatedActivity);
    await loadActivities();
    setFeedbackActivity(null);
  };

  const usedLetters = activities.map(a => a.letter);
  const completedActivities = activities.filter(a => a.isCompleted);
  const pendingActivities = activities.filter(a => !a.isCompleted);

  // Passcode Screen
  if (!isAuthenticated) {
    return <PasscodeScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  // Loading Screen
  if (isLoading) {
    return <CoffeeLoading onComplete={handleLoadingComplete} />;
  }

  // User Selection Screen
  if (!currentUser) {
    return <UserSelection onSelect={handleUserSelect} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <main className="flex-1 w-full px-4 sm:px-6 py-6 flex flex-col items-center justify-center">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-3 sm:gap-4">
            {[
              { id: 'spin' as View, label: 'Spin', Icon: Dices },
              { id: 'grid' as View, label: 'Grid', Icon: LayoutGrid },
              { id: 'activities' as View, label: 'Activities', Icon: ClipboardList },
            ].map(tab => {
              const isActive = currentView === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className="relative flex flex-col items-center gap-1.5 group"
                  whileTap={{ scale: 0.93 }}
                >
                  {/* Icon circle */}
                  <motion.div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #4A3428, #6F4E37)'
                        : 'rgba(255, 255, 255, 0.8)',
                      boxShadow: isActive
                        ? '0 6px 20px rgba(74, 52, 40, 0.3)'
                        : '0 2px 8px rgba(44, 24, 16, 0.06)',
                      border: isActive
                        ? 'none'
                        : '1.5px solid rgba(212, 165, 116, 0.2)',
                    }}
                    whileHover={{ y: -2 }}
                    animate={isActive ? { y: -2 } : { y: 0 }}
                  >
                    <tab.Icon
                      size={20}
                      className="transition-colors duration-300"
                      style={{ color: isActive ? '#FFFFFF' : '#8B7355' }}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                  </motion.div>

                  {/* Label */}
                  <span
                    className="text-[11px] font-semibold tracking-wide transition-colors duration-300"
                    style={{
                      color: isActive ? '#4A3428' : '#B8A08A',
                      fontFamily: "'Quicksand', sans-serif",
                    }}
                  >
                    {tab.label}
                  </span>

                  {/* Active dot indicator */}
                  <motion.div
                    className="h-1 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #D4A574, #6F4E37)' }}
                    initial={false}
                    animate={{
                      width: isActive ? 16 : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Spin View */}
          {currentView === 'spin' && (
            <motion.div
              key="spin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-col items-center w-full"
            >
              <div className="text-center mb-8 sm:mb-10">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-0"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#2C1810' }}
                >
                  Spin for Your Next Date!
                </h2>
                <p className="text-sm text-[#8B7355] mt-4 mb-8 sm:mb-10">
                  Let fate decide your next alphabet adventure
                </p>
                <p className="text-sm text-[#8B7355] mt-4 mb-8 sm:mb-10">
                  .
                </p>
              </div>
              <div className="mt-4">
                <SpinWheel onLetterSelected={handleLetterSelected} usedLetters={usedLetters} />
              </div>
            </motion.div>
          )}

          {/* Grid View */}
          {currentView === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-col items-center w-full"
            >
              <div className="text-center mb-6">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1.5"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#2C1810' }}
                >
                  Alphabet Overview
                </h2>
                <p className="text-sm text-[#8B7355]">
                  Click any letter to add or view activities
                </p>
              </div>
              <AlphabetGrid activities={activities} onLetterClick={handleLetterClick} />
            </motion.div>
          )}

          {/* Activities View */}
          {currentView === 'activities' && (
            <motion.div
              key="activities"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full"
            >
              <div className="text-center mb-6">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1.5"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#2C1810' }}
                >
                  Our Adventures
                </h2>
                <p className="text-sm text-[#8B7355]">
                  {activities.length === 0
                    ? 'No activities yet. Spin the wheel to get started!'
                    : `${completedActivities.length} memories made, ${pendingActivities.length} adventures awaiting`}
                </p>
              </div>

              {activities.length === 0 ? (
                <div className="text-center py-16">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(212, 165, 116, 0.12)' }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ClipboardList className="text-[#D4A574]" size={28} />
                  </motion.div>
                  <p className="text-[#8B7355] mb-5 text-sm">No activities yet!</p>
                  <button
                    onClick={() => setCurrentView('spin')}
                    className="btn-primary text-sm"
                  >
                    Spin the Wheel
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Pending Activities */}
                  {pendingActivities.length > 0 && (
                    <section>
                      <h3
                        className="text-lg font-bold mb-4 flex items-center justify-center gap-2"
                        style={{ fontFamily: "'Playfair Display', serif", color: '#4A3428' }}
                      >
                        Upcoming Adventures
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        {pendingActivities.map(activity => (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                            currentUser={currentUser}
                            onComplete={handleCompleteActivity}
                            onAddFeedback={handleAddFeedback}
                            onDelete={handleDeleteActivity}
                            onEdit={handleEditActivity}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Completed Activities */}
                  {completedActivities.length > 0 && (
                    <section>
                      <h3
                        className="text-lg font-bold mb-4 flex items-center justify-center gap-2"
                        style={{ fontFamily: "'Playfair Display', serif", color: '#4A3428' }}
                      >
                        Beautiful Memories
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        {completedActivities.map(activity => (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                            currentUser={currentUser}
                            onComplete={handleCompleteActivity}
                            onAddFeedback={handleAddFeedback}
                            onDelete={handleDeleteActivity}
                            onEdit={handleEditActivity}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer — polished */}
      <footer className="py-6 flex flex-col items-center gap-1.5 text-center">
        <div className="flex items-center gap-2 text-sm text-[#8B7355]">
          <span>Made with</span>
          <Coffee size={14} className="text-[#6F4E37]" />
          <span>&</span>
          <Heart size={14} className="text-[#DC2626]" fill="#DC2626" />
          <span>for</span>
          <span className="font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: '#4A3428' }}>—aa—</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#B8A08A]">
          <img src="/p.png" alt="Pisces" className="w-3.5 h-3.5 rounded-full object-cover opacity-60" />
          <span>Pisces</span>
          <span>+</span>
          <img src="/s.png" alt="Scorpio" className="w-3.5 h-3.5 rounded-full object-cover opacity-60" />
          <span>Scorpio</span>
          <span>=</span>
          <span>∞</span>
        </div>
      </footer>

      {/* Activity Form Modal */}
      <ActivityForm
        isOpen={showActivityForm}
        letter={selectedLetter || 'A'}
        onClose={() => {
          setShowActivityForm(false);
          setSelectedLetter(null);
          setEditingActivity(null);
        }}
        onSave={editingActivity ? handleUpdateActivity : handleCreateActivity}
        initialValue={editingActivity?.name || ''}
        isEdit={!!editingActivity}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={!!feedbackActivity}
        activity={feedbackActivity}
        currentUser={currentUser}
        onClose={() => setFeedbackActivity(null)}
        onSave={handleSaveFeedback}
      />

      {/* Romantic Switch User Popup */}
      <AnimatePresence>
        {showSwitchPopup && (
          <>
            <motion.div
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(44, 24, 16, 0.35)', backdropFilter: 'blur(8px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSwitchPopup(false)}
            />
            <motion.div
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[380px] px-4"
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <div
                className="relative overflow-hidden rounded-[24px] text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.97)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 25px 60px rgba(44, 24, 16, 0.15), 0 1px 3px rgba(44, 24, 16, 0.06)',
                  border: '1.5px solid rgba(212, 165, 116, 0.15)',
                }}
              >
                {/* Top accent bar */}
                <div
                  className="h-1 w-full"
                  style={{ background: 'linear-gradient(90deg, #DC2626, #D4A574, #1a1a1a)' }}
                />

                <div className="px-7 py-5">
                  {/* Icon + Text inline layout */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(220, 38, 38, 0.08)' }}
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <switchMessage.icon className="text-[#DC2626]" size={20} />
                    </motion.div>
                    <div className="text-left">
                      <h3
                        className="text-lg font-bold leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif", color: '#2C1810' }}
                      >
                        {switchMessage.text}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: '#8B7355' }}>
                        {switchMessage.sub}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <motion.button
                      onClick={() => setShowSwitchPopup(false)}
                      className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                      style={{
                        background: 'rgba(111, 78, 55, 0.08)',
                        color: '#6F4E37',
                        border: '1px solid rgba(111, 78, 55, 0.12)',
                      }}
                      whileHover={{ scale: 1.03, background: 'rgba(111, 78, 55, 0.14)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Stay Here
                    </motion.button>
                    <motion.button
                      onClick={handleConfirmSwitch}
                      className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 text-white"
                      style={{
                        background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                        boxShadow: '0 3px 10px rgba(220, 38, 38, 0.2)',
                      }}
                      whileHover={{ scale: 1.03, boxShadow: '0 5px 16px rgba(220, 38, 38, 0.3)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Heart size={11} fill="white" />
                      Switch ! 
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deletingActivity && (
          <>
            <motion.div
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(44, 24, 16, 0.4)', backdropFilter: 'blur(6px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingActivity(null)}
            />
            <motion.div
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[340px] px-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  boxShadow: '0 20px 50px rgba(44, 24, 16, 0.18)',
                  border: '1.5px solid rgba(220, 38, 38, 0.1)',
                }}
              >
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #DC2626, #EF4444)' }} />
                <div className="px-5 py-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(220, 38, 38, 0.08)' }}
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </div>
                    <div>
                      <h3
                        className="text-base font-bold leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif", color: '#2C1810' }}
                      >
                        Delete Activity?
                      </h3>
                      <p className="text-xs mt-1" style={{ color: '#8B7355' }}>
                        "<span className="font-medium text-[#4A3428]">{deletingActivity.name}</span>" will be permanently removed. This cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <motion.button
                      onClick={() => setDeletingActivity(null)}
                      className="px-4 py-2 rounded-full text-xs font-semibold"
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
                      onClick={handleConfirmDelete}
                      className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 text-white"
                      style={{
                        background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                        boxShadow: '0 3px 10px rgba(220, 38, 38, 0.2)',
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Trash2 size={11} />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

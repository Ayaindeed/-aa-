import { createClient } from '@supabase/supabase-js';
import type { Activity, Feedback } from '../types';

// These will be replaced with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== '' && supabaseAnonKey !== '';
};

// Activity operations
export const getActivities = async (): Promise<Activity[]> => {
  if (!isSupabaseConfigured() || !supabase) {
    return getFromLocalStorage('activities') || [];
  }
  
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('letter', { ascending: true });
  
  if (error) {
    console.error('Error fetching activities:', error);
    return getFromLocalStorage('activities') || [];
  }
  
  return data || [];
};

export const saveActivity = async (activity: Activity): Promise<Activity | null> => {
  if (!isSupabaseConfigured() || !supabase) {
    const activities = getFromLocalStorage('activities') || [];
    const existingIndex = activities.findIndex((a: Activity) => a.id === activity.id);
    
    if (existingIndex >= 0) {
      activities[existingIndex] = activity;
    } else {
      activities.push(activity);
    }
    
    saveToLocalStorage('activities', activities);
    return activity;
  }
  
  const { data, error } = await supabase
    .from('activities')
    .upsert(activity)
    .select()
    .single();
  
  if (error) {
    console.error('Error saving activity:', error);
    return null;
  }
  
  return data;
};

export const deleteActivity = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) {
    const activities = getFromLocalStorage('activities') || [];
    const filtered = activities.filter((a: Activity) => a.id !== id);
    saveToLocalStorage('activities', filtered);
    return true;
  }
  
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting activity:', error);
    return false;
  }
  
  return true;
};

// Feedback operations
export const getFeedbacks = async (activityId: string): Promise<Feedback[]> => {
  if (!isSupabaseConfigured() || !supabase) {
    const feedbacks = getFromLocalStorage('feedbacks') || [];
    return feedbacks.filter((f: Feedback) => f.activityId === activityId);
  }
  
  const { data, error } = await supabase
    .from('feedbacks')
    .select('*')
    .eq('activityId', activityId)
    .order('createdAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching feedbacks:', error);
    return [];
  }
  
  return data || [];
};

export const saveFeedback = async (feedback: Feedback): Promise<Feedback | null> => {
  if (!isSupabaseConfigured()) {
    const feedbacks = getFromLocalStorage('feedbacks') || [];
    const existingIndex = feedbacks.findIndex((f: Feedback) => f.id === feedback.id);
    
    if (existingIndex >= 0) {
      feedbacks[existingIndex] = feedback;
    } else {
      feedbacks.push(feedback);
    }
    
    saveToLocalStorage('feedbacks', feedbacks);
    return feedback;
  }
  
  const { data, error } = await supabase
    .from('feedbacks')
    .upsert(feedback)
    .select()
    .single();
  
  if (error) {
    console.error('Error saving feedback:', error);
    return null;
  }
  
  return data;
};

// Local storage fallback
const getFromLocalStorage = (key: string) => {
  try {
    const item = localStorage.getItem(`doublea_${key}`);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const saveToLocalStorage = (key: string, data: unknown) => {
  try {
    localStorage.setItem(`doublea_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Get current user from local storage
export const getCurrentUser = () => {
  return localStorage.getItem('doublea_currentUser') as 'AMR' | 'ASEI' | null;
};

export const setCurrentUser = (user: 'AMR' | 'ASEI') => {
  localStorage.setItem('doublea_currentUser', user);
};

export const clearCurrentUser = () => {
  localStorage.removeItem('doublea_currentUser');
};

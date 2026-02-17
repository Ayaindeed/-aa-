export type User = 'AMR' | 'ASEI';

export interface Activity {
  id: string;
  letter: string;
  name: string;
  isCompleted: boolean;
  completedDate?: string;
  feedbacks: Feedback[];
  createdAt: string;
}

export interface Feedback {
  id: string;
  activityId: string;
  user: User;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
}

export interface AppState {
  currentUser: User | null;
  activities: Activity[];
  isLoading: boolean;
}

// Activity suggestions for each letter
export const activitySuggestions: Record<string, string[]> = {
  A: ['Art Gallery Visit', 'Aquarium Date', 'Archery', 'Apple Picking', 'Arcade Night'],
  B: ['Bowling', 'Beach Day', 'Baking Together', 'Bike Ride', 'Brunch Date'],
  C: ['Coffee Tasting', 'Cinema Night', 'Cooking Class', 'Camping', 'Concert'],
  D: ['Dancing', 'Dinner Date', 'DIY Crafts', 'Dog Park Visit', 'Dessert Crawl'],
  E: ['Escape Room', 'Evening Walk', 'Exhibition', 'Exploring New Area', 'Exercise Together'],
  F: ['Fondue Night', 'Farmers Market', 'Fishing', 'Flower Picking', 'Food Festival'],
  G: ['Game Night', 'Garden Visit', 'Go-Kart Racing', 'Glamping', 'Gym Session'],
  H: ['Hiking', 'Hot Springs', 'Home Spa Day', 'Horse Riding', 'Home Movie Night'],
  I: ['Ice Skating', 'Indoor Rock Climbing', 'Ice Cream Date', 'Italian Cooking', 'Island Trip'],
  J: ['Jazz Night', 'Jet Skiing', 'Jigsaw Puzzle', 'Japanese Restaurant', 'Journaling Together'],
  K: ['Karaoke', 'Kayaking', 'Kite Flying', 'Korean BBQ', 'Kitchen Experiment'],
  L: ['Laser Tag', 'Library Date', 'Lake Day', 'Live Music', 'Late Night Drive'],
  M: ['Museum Visit', 'Mini Golf', 'Mountain Hike', 'Massage', 'Movie Marathon'],
  N: ['Night Photography', 'Nature Walk', 'Noodle Making', 'Neighborhood Exploration', 'Netflix Marathon'],
  O: ['Outdoor Picnic', 'Opera Night', 'Observatory Visit', 'Origami', 'Ocean Swim'],
  P: ['Pottery Class', 'Picnic', 'Paint Night', 'Photography Walk', 'Pizza Making'],
  Q: ['Quiz Night', 'Quiet Reading', 'Quilting', 'Quick Getaway', 'Quality Time Walk'],
  R: ['Road Trip', 'Restaurant Hopping', 'Rollerblading', 'Rooftop Bar', 'Rainy Day Indoors'],
  S: ['Stargazing', 'Spa Day', 'Sunset Watching', 'Snorkeling', 'Shopping Date'],
  T: ['Theater Show', 'Thrift Shopping', 'Tennis', 'Tea Ceremony', 'Trivia Night'],
  U: ['Urban Exploring', 'Ukulele Learning', 'Underground Tour', 'Unplug Day', 'Upscale Dinner'],
  V: ['Vineyard Visit', 'Volunteer Together', 'Video Game Night', 'Vintage Shopping', 'Vacation Planning'],
  W: ['Wine Tasting', 'Waterfall Hike', 'Workout Class', 'Walking Tour', 'Waffle Making'],
  X: ['X-treme Sports', 'Xbox Gaming', 'Xmas Market', 'X-ray Fish Watching', 'Xperiment Cooking'],
  Y: ['Yoga Class', 'Yacht Trip', 'Yard Games', 'YouTube Cooking Challenge', 'Year Planning'],
  Z: ['Zoo Visit', 'Zen Garden', 'Ziplining', 'Zero Waste Shopping', 'Zodiac Reading']
};

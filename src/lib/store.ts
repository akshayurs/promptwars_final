import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  name: string;
  age: string;
  targetExams: string[];
  uid?: string;
  isGuest?: boolean;
}

interface WellnessHistory {
  date: string;
  hp: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  feedback: string;
  pointsAwarded: number;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

interface WellnessState {
  rockHealth: number;
  mossLevel: number;
  history: WellnessHistory[];
  journals: JournalEntry[];
}

interface PebblStore {
  profile: UserProfile | null;
  wellness: WellnessState;
  chatHistory: ChatMessage[];
  setProfile: (profile: UserProfile | null) => void;
  updateWellness: (updates: Partial<WellnessState>) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  reset: () => void;
}

const initialState = {
  profile: null,
  wellness: {
    rockHealth: 100,
    mossLevel: 0,
    history: [],
    journals: [],
  },
  chatHistory: [],
};

export const useStore = create<PebblStore>()(
  persist(
    (set) => ({
      ...initialState,
      setProfile: (profile) => set({ profile }),
      updateWellness: (updates) => 
        set((state) => {
          const newHealth = updates.rockHealth ?? state.wellness.rockHealth;
          // Ensure history is initialized
          const newHistory = [...(state.wellness.history || [])];
          
          // If health changed, add a new data point to history
          if (updates.rockHealth !== undefined && updates.rockHealth !== state.wellness.rockHealth) {
            newHistory.push({ date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), hp: newHealth });
            if (newHistory.length > 10) newHistory.shift(); // Keep last 10 points
          }

          return { 
            wellness: { 
              ...state.wellness, 
              ...updates,
              history: newHistory,
              journals: state.wellness.journals || [] 
            } 
          };
        }),
      addChatMessage: (msg) => 
        set((state) => ({ 
          chatHistory: [...(state.chatHistory || []), msg] 
        })),
      clearChat: () => set({ chatHistory: [] }),
      reset: () => set(initialState),
    }),
    {
      name: 'pebbl-storage',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as PebblStore;
        if (version === 0) {
          // If the user's cached state contains the old 'Mon'/'Tue' mock data, wipe it out
          if (state?.wellness?.history?.some((h: WellnessHistory) => h.date === 'Mon')) {
            state.wellness.history = [];
          }
        }
        return state;
      }
    }
  )
);

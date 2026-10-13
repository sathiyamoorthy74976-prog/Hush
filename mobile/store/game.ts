import { create } from 'zustand';

export const SPARK_STAGES = 5;

type GameState = {
  nickname: string;
  interests: string[];
  streak: number;
  xp: number;
  xpToNext: number;
  energy: number;
  league: string;
  spark: number;
  stage: number;
  theirChoice: 'pending' | 'match' | 'pass';
  myChoice: 'pending' | 'match' | 'pass';
  setNickname: (nickname: string) => void;
  toggleInterest: (tag: string) => void;
  useEnergy: () => boolean;
  addXp: (amount: number) => void;
  bumpStreak: () => void;
  setSparkStage: (stage: number) => void;
  bumpSpark: () => void;
  resetSession: () => void;
  setMyChoice: (choice: 'match' | 'pass') => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  nickname: 'Nova',
  interests: ['Music', 'Late nights'],
  streak: 6,
  xp: 240,
  xpToNext: 400,
  energy: 5,
  league: 'Ruby',
  spark: 0,
  stage: 0,
  theirChoice: 'pending',
  myChoice: 'pending',
  setNickname: (nickname) => set({ nickname }),
  toggleInterest: (tag) =>
    set((s) => ({
      interests: s.interests.includes(tag)
        ? s.interests.filter((t) => t !== tag)
        : [...s.interests, tag],
    })),
  useEnergy: () => {
    if (get().energy <= 0) return false;
    set((s) => ({ energy: s.energy - 1 }));
    return true;
  },
  addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
  bumpStreak: () => set((s) => ({ streak: s.streak + 1 })),
  setSparkStage: (stage) =>
    set({ stage: Math.min(SPARK_STAGES, Math.max(0, stage)), spark: Math.min(SPARK_STAGES, Math.max(0, stage)) }),
  bumpSpark: () => {
    const next = Math.min(SPARK_STAGES, get().stage + 1);
    set({ stage: next, spark: next });
  },
  resetSession: () => set({ spark: 0, stage: 0, myChoice: 'pending', theirChoice: 'pending' }),
  setMyChoice: (choice) => set({ myChoice: choice, theirChoice: choice === 'pass' ? 'pass' : 'match' }),
}));

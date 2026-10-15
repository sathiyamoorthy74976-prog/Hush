import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ProfileStepKey } from '@/navigation/ProfileStack';

export type LookingFor = 'serious' | 'casual' | 'friendship' | 'not_sure';
export type InterestReaction = 'obsessed' | 'like' | 'casual';

const REACTION_SCORE: Record<InterestReaction, number> = {
  obsessed: 3,
  like: 2,
  casual: 1,
};

export type LifestyleChoice =
  | 'prefer_not_to_say'
  | string;

export type LifestyleState = {
  drinking: LifestyleChoice | null;
  smoking: LifestyleChoice | null;
  workout: LifestyleChoice | null;
  sleep: LifestyleChoice | null;
  diet: LifestyleChoice | null;
  pets: LifestyleChoice | null;
};

export type FamilyPlans = 'want_kids' | 'open_to_kids' | 'dont_want_kids' | 'not_sure' | 'prefer_not_to_say';

export type ProfilePromptAnswer = {
  promptId: string;
  answer: string;
};

export type DealBreakerEntry = {
  questionId: string;
  acceptable: boolean;
};

export type LifePhoto = {
  uri: string;
  caption?: string;
};

export type ProfileDraftData = {
  lookingFor: LookingFor | null;
  interests: Record<string, { score: number; reaction?: InterestReaction }>;
  lifestyle: LifestyleState;
  familyPlans: FamilyPlans | null;
  values: string[];
  prompts: ProfilePromptAnswer[];
  dealBreakers: DealBreakerEntry[];
  profilePictureUri: string | null;
  lifePhotos: LifePhoto[];
  completedAt: string | null;
};

type ProfileDraftState = ProfileDraftData & {
  setLookingFor: (value: LookingFor) => void;
  toggleInterest: (interest: string) => void;
  setInterestReaction: (interest: string, reaction: InterestReaction) => void;
  removeInterest: (interest: string) => void;
  setLifestyle: (key: keyof LifestyleState, value: LifestyleChoice) => void;
  setLifestylePreferNotToSayAll: () => void;
  setFamilyPlans: (value: FamilyPlans) => void;
  setValues: (values: string[]) => void;
  setPrompts: (prompts: ProfilePromptAnswer[]) => void;
  setDealBreakers: (entries: DealBreakerEntry[]) => void;
  toggleDealBreakerQuestion: (questionId: string) => void;
  setDealBreakerAcceptable: (questionId: string, acceptable: boolean) => void;
  setProfilePictureUri: (uri: string | null) => void;
  setLifePhotos: (photos: LifePhoto[]) => void;
  markCompleted: () => void;
  resetDraft: () => void;
  getTopInterests: () => string[];
  isStepValid: (stepKey: ProfileStepKey) => boolean;
};

const LIFESTYLE_KEYS: (keyof LifestyleState)[] = [
  'drinking',
  'smoking',
  'workout',
  'sleep',
  'diet',
  'pets',
];

export const emptyLifestyle = (): LifestyleState => ({
  drinking: null,
  smoking: null,
  workout: null,
  sleep: null,
  diet: null,
  pets: null,
});

export const initialProfileDraft: ProfileDraftData = {
  lookingFor: null,
  interests: {},
  lifestyle: emptyLifestyle(),
  familyPlans: null,
  values: [],
  prompts: [],
  dealBreakers: [],
  profilePictureUri: null,
  lifePhotos: [],
  completedAt: null,
};

function interestEntriesValid(interests: ProfileDraftData['interests']) {
  const keys = Object.keys(interests);
  if (keys.length < 5 || keys.length > 10) return false;
  return keys.every((k) => interests[k]?.reaction != null);
}

function lifestyleValid(lifestyle: LifestyleState) {
  return LIFESTYLE_KEYS.every((k) => lifestyle[k] != null);
}

function isStepValidForDraft(stepKey: ProfileStepKey, draft: ProfileDraftData): boolean {
  switch (stepKey) {
    case 'looking-for':
      return draft.lookingFor != null;
    case 'interests':
      return interestEntriesValid(draft.interests);
    case 'lifestyle':
      return lifestyleValid(draft.lifestyle);
    case 'family-plans':
      return draft.familyPlans != null;
    case 'values':
      return draft.values.length === 5;
    case 'prompts':
      if (draft.prompts.length < 1 || draft.prompts.length > 3) return false;
      return draft.prompts.every((p) => p.answer.trim().length > 0);
    case 'deal-breakers':
      return draft.dealBreakers.length >= 1;
    case 'profile-picture':
      return draft.profilePictureUri != null && draft.profilePictureUri.length > 0;
    case 'life-photos':
      return draft.lifePhotos.length >= 3 && draft.lifePhotos.length <= 6;
    default:
      return false;
  }
}

export const useProfileDraftStore = create<ProfileDraftState>()(
  persist(
    (set, get) => ({
      ...initialProfileDraft,

      setLookingFor: (value) => set({ lookingFor: value }),

      toggleInterest: (interest) =>
        set((s) => {
          if (s.interests[interest]) {
            const next = { ...s.interests };
            delete next[interest];
            return { interests: next };
          }
          if (Object.keys(s.interests).length >= 10) return s;
          return {
            interests: {
              ...s.interests,
              [interest]: { score: 0 },
            },
          };
        }),

      setInterestReaction: (interest, reaction) =>
        set((s) => ({
          interests: {
            ...s.interests,
            [interest]: { score: REACTION_SCORE[reaction], reaction },
          },
        })),

      removeInterest: (interest) =>
        set((s) => {
          const next = { ...s.interests };
          delete next[interest];
          return { interests: next };
        }),

      setLifestyle: (key, value) =>
        set((s) => ({
          lifestyle: { ...s.lifestyle, [key]: value },
        })),

      setLifestylePreferNotToSayAll: () =>
        set({
          lifestyle: {
            drinking: 'prefer_not_to_say',
            smoking: 'prefer_not_to_say',
            workout: 'prefer_not_to_say',
            sleep: 'prefer_not_to_say',
            diet: 'prefer_not_to_say',
            pets: 'prefer_not_to_say',
          },
        }),

      setFamilyPlans: (value) => set({ familyPlans: value }),

      setValues: (values) => set({ values: values.slice(0, 5) }),

      setPrompts: (prompts) => set({ prompts: prompts.slice(0, 3) }),

      setDealBreakers: (entries) => set({ dealBreakers: entries }),

      toggleDealBreakerQuestion: (questionId) =>
        set((s) => {
          const exists = s.dealBreakers.find((e) => e.questionId === questionId);
          if (exists) {
            return { dealBreakers: s.dealBreakers.filter((e) => e.questionId !== questionId) };
          }
          return {
            dealBreakers: [...s.dealBreakers, { questionId, acceptable: true }],
          };
        }),

      setDealBreakerAcceptable: (questionId, acceptable) =>
        set((s) => ({
          dealBreakers: s.dealBreakers.map((e) =>
            e.questionId === questionId ? { ...e, acceptable } : e,
          ),
        })),

      setProfilePictureUri: (uri) => set({ profilePictureUri: uri }),

      setLifePhotos: (photos) => set({ lifePhotos: photos.slice(0, 6) }),

      markCompleted: () => set({ completedAt: new Date().toISOString() }),

      resetDraft: () => set({ ...initialProfileDraft, lifestyle: emptyLifestyle() }),

      getTopInterests: () => {
        const entries = Object.entries(get().interests);
        entries.sort((a, b) => b[1].score - a[1].score);
        return entries.slice(0, 3).map(([name]) => name);
      },

      isStepValid: (stepKey) => isStepValidForDraft(stepKey, get()),
    }),
    {
      name: 'hush-profile-draft',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lookingFor: state.lookingFor,
        interests: state.interests,
        lifestyle: state.lifestyle,
        familyPlans: state.familyPlans,
        values: state.values,
        prompts: state.prompts,
        dealBreakers: state.dealBreakers,
        profilePictureUri: state.profilePictureUri,
        lifePhotos: state.lifePhotos,
        completedAt: state.completedAt,
      }),
    },
  ),
);

export { isStepValidForDraft, interestEntriesValid, lifestyleValid };

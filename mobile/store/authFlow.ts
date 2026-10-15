import { create } from 'zustand';

export type AuthMode = 'create' | 'login';

type State = {
  mode: AuthMode;
  countryLabel: string;
  dialCode: string;
  phoneDigits: string;
  setMode: (mode: AuthMode) => void;
  setPhoneDigits: (digits: string) => void;
  resetPhone: () => void;
};

export function isPhoneValid(digits: string) {
  const d = digits.replace(/\D/g, '');
  return d.length >= 8;
}

export function formatPhoneDisplay(dialCode: string, digits: string) {
  const d = digits.replace(/\D/g, '');
  return `${dialCode}${d}`;
}

export const useAuthFlowStore = create<State>((set) => ({
  mode: 'create',
  countryLabel: 'SG',
  dialCode: '+65',
  phoneDigits: '',
  setMode: (mode) => set({ mode }),
  setPhoneDigits: (phoneDigits) => set({ phoneDigits: phoneDigits.replace(/\D/g, '').slice(0, 12) }),
  resetPhone: () => set({ phoneDigits: '' }),
}));

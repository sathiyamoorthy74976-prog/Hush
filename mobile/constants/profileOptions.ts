import type { FamilyPlans, LookingFor } from '@/store/profileDraft';
import type { LifestyleState } from '@/store/profileDraft';

export type LookingForOption = {
  id: LookingFor;
  title: string;
  subtitle: string;
  emoji: string;
};

export const LOOKING_FOR_OPTIONS: LookingForOption[] = [
  { id: 'serious', title: 'Something serious', subtitle: 'Ready for a real connection on campus', emoji: '💛' },
  { id: 'casual', title: 'Keeping it casual', subtitle: 'Low pressure, good vibes first', emoji: '✨' },
  { id: 'friendship', title: 'New friends', subtitle: 'Meet people beyond your usual circle', emoji: '🤝' },
  { id: 'not_sure', title: 'Still figuring it out', subtitle: 'Open to seeing where chats go', emoji: '🌱' },
];

export const INTEREST_TAGS = [
  'Music',
  'Late nights',
  'Studio',
  'Startups',
  'Gym',
  'Anime',
  'Coffee',
  'Design',
  'Photography',
  'Gaming',
  'Hiking',
  'Reading',
  'Cooking',
  'Dancing',
  'Film',
  'Volunteering',
  'Sports',
  'Art',
  'Tech',
  'Fashion',
  'Travel',
  'Meditation',
  'Comedy',
  'Foodie',
];

export type LifestyleGroupKey = keyof LifestyleState;

export const LIFESTYLE_GROUPS: {
  key: LifestyleGroupKey;
  label: string;
  options: { id: string; label: string }[];
}[] = [
  {
    key: 'drinking',
    label: 'Drinking',
    options: [
      { id: 'never', label: 'Never' },
      { id: 'socially', label: 'Socially' },
      { id: 'often', label: 'Often' },
      { id: 'prefer_not_to_say', label: 'Prefer not to say' },
    ],
  },
  {
    key: 'smoking',
    label: 'Smoking',
    options: [
      { id: 'no', label: 'No' },
      { id: 'sometimes', label: 'Sometimes' },
      { id: 'yes', label: 'Yes' },
      { id: 'prefer_not_to_say', label: 'Prefer not to say' },
    ],
  },
  {
    key: 'workout',
    label: 'Workout',
    options: [
      { id: 'daily', label: 'Daily' },
      { id: 'few_times_week', label: 'Few times a week' },
      { id: 'sometimes', label: 'Sometimes' },
      { id: 'rarely', label: 'Rarely' },
      { id: 'prefer_not_to_say', label: 'Prefer not to say' },
    ],
  },
  {
    key: 'sleep',
    label: 'Sleep',
    options: [
      { id: 'early_bird', label: 'Early bird' },
      { id: 'night_owl', label: 'Night owl' },
      { id: 'depends', label: 'Depends on the week' },
      { id: 'prefer_not_to_say', label: 'Prefer not to say' },
    ],
  },
  {
    key: 'diet',
    label: 'Diet',
    options: [
      { id: 'anything', label: 'Eat anything' },
      { id: 'vegetarian', label: 'Vegetarian' },
      { id: 'vegan', label: 'Vegan' },
      { id: 'halal', label: 'Halal' },
      { id: 'other', label: 'Other' },
      { id: 'prefer_not_to_say', label: 'Prefer not to say' },
    ],
  },
  {
    key: 'pets',
    label: 'Pets',
    options: [
      { id: 'have', label: 'Have pets' },
      { id: 'want', label: 'Want pets' },
      { id: 'allergic', label: 'Allergic' },
      { id: 'none', label: 'Not a pet person' },
      { id: 'prefer_not_to_say', label: 'Prefer not to say' },
    ],
  },
];

export type FamilyPlansOption = {
  id: FamilyPlans;
  title: string;
  subtitle: string;
};

export const FAMILY_PLANS_OPTIONS: FamilyPlansOption[] = [
  { id: 'want_kids', title: 'Want kids someday', subtitle: 'Family is part of my future' },
  { id: 'open_to_kids', title: 'Open to kids', subtitle: 'Flexible depending on the person' },
  { id: 'dont_want_kids', title: "Don't want kids", subtitle: 'Not planning on having children' },
  { id: 'not_sure', title: 'Not sure yet', subtitle: 'Still thinking it through' },
  { id: 'prefer_not_to_say', title: 'Prefer not to say', subtitle: 'Keep this private for now' },
];

export const VALUES_POOL = [
  'Honesty',
  'Ambition',
  'Humor',
  'Kindness',
  'Loyalty',
  'Curiosity',
  'Empathy',
  'Independence',
  'Communication',
  'Adventure',
  'Stability',
  'Creativity',
];

export type PromptTemplate = {
  id: string;
  question: string;
  maxChars: number;
};

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  { id: 'green_flag', question: 'A green flag I look for on campus is…', maxChars: 150 },
  { id: 'perfect_date', question: 'My ideal low-key date near school would be…', maxChars: 150 },
  { id: 'nerd_about', question: "I'm low-key obsessed with…", maxChars: 120 },
  { id: 'deal_soft', question: 'Something small that wins me over is…', maxChars: 150 },
  { id: 'weekend', question: 'You will usually find me on weekends…', maxChars: 150 },
  { id: 'hot_take', question: 'A campus hot take I will defend is…', maxChars: 120 },
  { id: 'friend_desc', question: 'My friends would describe me as…', maxChars: 150 },
  { id: 'chat_starter', question: 'The best way to start a chat with me is…', maxChars: 150 },
];

export type DealBreakerQuestion = {
  id: string;
  label: string;
};

export const DEAL_BREAKER_QUESTIONS: DealBreakerQuestion[] = [
  { id: 'smoking', label: 'Do you smoke?' },
  { id: 'drinking', label: 'How often do you drink?' },
  { id: 'kids', label: 'Do you want kids someday?' },
  { id: 'religion', label: 'Is faith important in your life?' },
  { id: 'politics', label: 'Do you care about political alignment?' },
  { id: 'monogamy', label: 'Are you looking for something exclusive?' },
];

export function lookingForLabel(id: LookingFor | null): string {
  if (!id) return '';
  return LOOKING_FOR_OPTIONS.find((o) => o.id === id)?.title ?? id;
}

export function familyPlansLabel(id: FamilyPlans | null): string {
  if (!id) return '';
  return FAMILY_PLANS_OPTIONS.find((o) => o.id === id)?.title ?? id;
}

export function lifestyleSummary(lifestyle: LifestyleState): string {
  const parts: string[] = [];
  for (const group of LIFESTYLE_GROUPS) {
    const val = lifestyle[group.key];
    if (!val || val === 'prefer_not_to_say') continue;
    const opt = group.options.find((o) => o.id === val);
    if (opt) parts.push(`${group.label}: ${opt.label}`);
  }
  return parts.slice(0, 3).join(' · ') || 'Lifestyle added';
}

export function getPromptQuestion(promptId: string): string {
  return PROMPT_TEMPLATES.find((p) => p.id === promptId)?.question ?? promptId;
}

export function getPromptMaxChars(promptId: string): number {
  return PROMPT_TEMPLATES.find((p) => p.id === promptId)?.maxChars ?? 150;
}

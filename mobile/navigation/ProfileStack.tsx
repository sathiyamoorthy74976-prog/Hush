import type { Href } from 'expo-router';

export type ProfileStepKey =
  | 'looking-for'
  | 'interests'
  | 'lifestyle'
  | 'family-plans'
  | 'values'
  | 'prompts'
  | 'deal-breakers'
  | 'profile-picture'
  | 'life-photos';

export type ProfileRoute =
  | `/profile/${ProfileStepKey}`
  | '/profile/preview';

export type ProfileStepConfig = {
  key: ProfileStepKey;
  route: `/profile/${ProfileStepKey}`;
  step: number;
  title: string;
  skippable: boolean;
};

export const PROFILE_STEP_TOTAL = 9;

export const PROFILE_PREVIEW_ROUTE = '/profile/preview' as const;

export const PROFILE_STEPS: ProfileStepConfig[] = [
  {
    key: 'looking-for',
    route: '/profile/looking-for',
    step: 1,
    title: 'Looking for',
    skippable: false,
  },
  {
    key: 'interests',
    route: '/profile/interests',
    step: 2,
    title: 'Interests',
    skippable: false,
  },
  {
    key: 'lifestyle',
    route: '/profile/lifestyle',
    step: 3,
    title: 'Lifestyle',
    skippable: true,
  },
  {
    key: 'family-plans',
    route: '/profile/family-plans',
    step: 4,
    title: 'Family plans',
    skippable: false,
  },
  {
    key: 'values',
    route: '/profile/values',
    step: 5,
    title: 'Values',
    skippable: false,
  },
  {
    key: 'prompts',
    route: '/profile/prompts',
    step: 6,
    title: 'Prompts',
    skippable: true,
  },
  {
    key: 'deal-breakers',
    route: '/profile/deal-breakers',
    step: 7,
    title: 'Deal breakers',
    skippable: true,
  },
  {
    key: 'profile-picture',
    route: '/profile/profile-picture',
    step: 8,
    title: 'Profile picture',
    skippable: false,
  },
  {
    key: 'life-photos',
    route: '/profile/life-photos',
    step: 9,
    title: 'Life photos',
    skippable: true,
  },
];

export const PROFILE_FIRST_ROUTE = PROFILE_STEPS[0].route;

export function profileHref(route: ProfileRoute | string): Href {
  return route as Href;
}

export function getStepByKey(key: ProfileStepKey): ProfileStepConfig {
  const step = PROFILE_STEPS.find((s) => s.key === key);
  if (!step) throw new Error(`Unknown profile step: ${key}`);
  return step;
}

export function getStepByRoute(route: string): ProfileStepConfig | null {
  return PROFILE_STEPS.find((s) => s.route === route) ?? null;
}

export function getNextRoute(currentKey: ProfileStepKey): ProfileRoute {
  const index = PROFILE_STEPS.findIndex((s) => s.key === currentKey);
  if (index < 0) return PROFILE_FIRST_ROUTE;
  if (index >= PROFILE_STEPS.length - 1) return PROFILE_PREVIEW_ROUTE;
  return PROFILE_STEPS[index + 1].route;
}

export function getPrevRoute(currentKey: ProfileStepKey): string | null {
  const index = PROFILE_STEPS.findIndex((s) => s.key === currentKey);
  if (index <= 0) return null;
  return PROFILE_STEPS[index - 1].route;
}

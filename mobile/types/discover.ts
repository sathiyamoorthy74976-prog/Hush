import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type DiscoverInterest = {
  id: string;
  label: string;
  icon: IoniconName;
};

export type DiscoverComment = {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
};

export type DiscoverPrompt = {
  question: string;
  answer: string;
  liked: boolean;
  comments: DiscoverComment[];
};

export type DiscoverPronoun = 'her' | 'his' | 'their';

export type DiscoverProfile = {
  id: string;
  name: string;
  age: number;
  verified: boolean;
  pronoun: DiscoverPronoun;
  locationLabel: string;
  distanceKm: number;
  photoUri: string;
  interests: DiscoverInterest[];
  prompt: DiscoverPrompt;
};

export type DiscoverFilterPrefs = {
  ageMin: number;
  ageMax: number;
  maxDistanceKm: number;
  lookingFor: string;
};

export type DiscoverFeedItem = DiscoverProfile | { id: 'caught-up'; kind: 'caught-up' };

export function isCaughtUpItem(item: DiscoverFeedItem): item is { id: 'caught-up'; kind: 'caught-up' } {
  return 'kind' in item && item.kind === 'caught-up';
}

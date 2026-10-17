import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
  DiscoverFeedItem,
  DiscoverFilterPrefs,
  DiscoverProfile,
} from '@/types/discover';

const MOCK_LOAD_MS = 900;

const MOCK_PROFILES: DiscoverProfile[] = [
  {
    id: '1',
    name: 'Ananya',
    age: 20,
    verified: true,
    pronoun: 'her',
    locationLabel: 'SRM KTR',
    distanceKm: 2,
    photoUri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    interests: [
      { id: 'music', label: 'Music', icon: 'musical-notes-outline' },
      { id: 'travel', label: 'Travelling', icon: 'airplane-outline' },
      { id: 'food', label: 'Foodie', icon: 'restaurant-outline' },
    ],
    prompt: {
      question: 'What’s a small thing that instantly makes your day better?',
      answer: 'Filter coffee and a rainy evening.',
      liked: false,
      comments: [
        {
          id: 'c1',
          authorName: 'Mira',
          text: 'Same — filter kaapi hits different.',
          createdAt: '2h ago',
        },
        {
          id: 'c2',
          authorName: 'Jo',
          text: 'Rainy evenings are undefeated.',
          createdAt: '5h ago',
        },
        {
          id: 'c3',
          authorName: 'Sam',
          text: 'Need that vibe this week.',
          createdAt: '1d ago',
        },
      ],
    },
  },
  {
    id: '2',
    name: 'Rae',
    age: 21,
    verified: true,
    pronoun: 'their',
    locationLabel: 'SRM KTR',
    distanceKm: 1,
    photoUri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    interests: [
      { id: 'music', label: 'Music', icon: 'musical-notes-outline' },
      { id: 'design', label: 'Design', icon: 'color-palette-outline' },
      { id: 'coffee', label: 'Coffee', icon: 'cafe-outline' },
    ],
    prompt: {
      question: 'Green flag you notice right away?',
      answer: 'They actually listen when you talk.',
      liked: false,
      comments: [],
    },
  },
  {
    id: '3',
    name: 'Kenji',
    age: 22,
    verified: false,
    pronoun: 'his',
    locationLabel: 'SRM KTR',
    distanceKm: 3,
    photoUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    interests: [
      { id: 'gym', label: 'Gym', icon: 'barbell-outline' },
      { id: 'anime', label: 'Anime', icon: 'film-outline' },
      { id: 'gaming', label: 'Gaming', icon: 'game-controller-outline' },
    ],
    prompt: {
      question: 'Best campus spot nobody talks about?',
      answer: 'The quiet corner behind the old library steps.',
      liked: false,
      comments: [
        {
          id: 'c4',
          authorName: 'Ivy',
          text: 'Wait that place is actually perfect.',
          createdAt: '3h ago',
        },
      ],
    },
  },
  {
    id: '4',
    name: 'Sola',
    age: 19,
    verified: true,
    pronoun: 'her',
    locationLabel: 'SRM KTR',
    distanceKm: 4,
    photoUri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80',
    interests: [
      { id: 'art', label: 'Art', icon: 'brush-outline' },
      { id: 'film', label: 'Film', icon: 'videocam-outline' },
      { id: 'food', label: 'Foodie', icon: 'restaurant-outline' },
    ],
    prompt: {
      question: 'What song are you looping this week?',
      answer: 'Anything with a warm bassline.',
      liked: false,
      comments: [],
    },
  },
  {
    id: '5',
    name: 'Dev',
    age: 23,
    verified: true,
    pronoun: 'his',
    locationLabel: 'SRM KTR',
    distanceKm: 2,
    photoUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    interests: [
      { id: 'tech', label: 'Tech', icon: 'hardware-chip-outline' },
      { id: 'startups', label: 'Startups', icon: 'rocket-outline' },
      { id: 'music', label: 'Music', icon: 'musical-notes-outline' },
    ],
    prompt: {
      question: 'Ideal first hang on campus?',
      answer: 'Sunset walk, then chai somewhere loud.',
      liked: false,
      comments: [],
    },
  },
  {
    id: '6',
    name: 'Mira',
    age: 20,
    verified: true,
    pronoun: 'her',
    locationLabel: 'SRM KTR',
    distanceKm: 1,
    photoUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    interests: [
      { id: 'dance', label: 'Dance', icon: 'body-outline' },
      { id: 'travel', label: 'Travelling', icon: 'airplane-outline' },
      { id: 'reading', label: 'Reading', icon: 'book-outline' },
    ],
    prompt: {
      question: 'A hill you’ll die on?',
      answer: 'Breakfast food works at any hour.',
      liked: false,
      comments: [],
    },
  },
];

function cloneProfiles(source: DiscoverProfile[]): DiscoverProfile[] {
  return source.map((p) => ({
    ...p,
    interests: [...p.interests],
    prompt: {
      ...p.prompt,
      comments: [...p.prompt.comments],
    },
  }));
}

export function useDiscoverFeed() {
  const [profiles, setProfiles] = useState<DiscoverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasNewLikes, setHasNewLikes] = useState(true);
  const [filters, setFilters] = useState<DiscoverFilterPrefs>({
    ageMin: 18,
    ageMax: 26,
    maxDistanceKm: 10,
    lookingFor: 'not_sure',
  });

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    await new Promise((r) => setTimeout(r, isRefresh ? 500 : MOCK_LOAD_MS));
    setProfiles(cloneProfiles(MOCK_PROFILES));
    if (isRefresh) {
      setCurrentIndex(0);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const feedItems: DiscoverFeedItem[] = useMemo(
    () => [...profiles, { id: 'caught-up', kind: 'caught-up' }],
    [profiles],
  );

  const activeProfile =
    currentIndex < profiles.length ? profiles[currentIndex] : undefined;

  const refresh = useCallback(() => load(true), [load]);

  const goToIndex = useCallback(
    (index: number) => {
      const max = feedItems.length - 1;
      setCurrentIndex(Math.max(0, Math.min(index, max)));
    },
    [feedItems.length],
  );

  const goNext = useCallback(() => {
    goToIndex(currentIndex + 1);
  }, [currentIndex, goToIndex]);

  const goPrev = useCallback(() => {
    goToIndex(currentIndex - 1);
  }, [currentIndex, goToIndex]);

  const toggleLike = useCallback((profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? { ...p, prompt: { ...p.prompt, liked: !p.prompt.liked } }
          : p,
      ),
    );
  }, []);

  const addComment = useCallback((profileId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const comment = {
      id: `local-${Date.now()}`,
      authorName: 'You',
      text: trimmed,
      createdAt: 'Just now',
    };
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? {
              ...p,
              prompt: {
                ...p.prompt,
                comments: [...p.prompt.comments, comment],
              },
            }
          : p,
      ),
    );
  }, []);

  const clearNewLikes = useCallback(() => setHasNewLikes(false), []);

  return {
    profiles,
    feedItems,
    loading,
    refreshing,
    currentIndex,
    setCurrentIndex: goToIndex,
    activeProfile,
    refresh,
    goNext,
    goPrev,
    toggleLike,
    addComment,
    filters,
    setFilters,
    hasNewLikes,
    clearNewLikes,
  };
}

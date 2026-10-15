import { useRouter } from 'expo-router';

import {
  getNextRoute,
  getPrevRoute,
  getStepByKey,
  profileHref,
  PROFILE_PREVIEW_ROUTE,
  PROFILE_STEP_TOTAL,
  type ProfileStepKey,
} from '@/navigation/ProfileStack';
import { useProfileDraftStore } from '@/store/profileDraft';

export function useProfileStepNavigation(stepKey: ProfileStepKey) {
  const router = useRouter();
  const config = getStepByKey(stepKey);
  const isValid = useProfileDraftStore((s) => s.isStepValid(stepKey));
  const setLifestylePreferNotToSayAll = useProfileDraftStore((s) => s.setLifestylePreferNotToSayAll);

  const onBack = () => {
    const prev = getPrevRoute(stepKey);
    if (prev) router.push(profileHref(prev));
    else router.back();
  };

  const onContinue = () => {
    if (!isValid) return;
    router.push(profileHref(getNextRoute(stepKey)));
  };

  const onSkip = () => {
    if (stepKey === 'lifestyle') {
      setLifestylePreferNotToSayAll();
    }
    router.push(profileHref(getNextRoute(stepKey)));
  };

  return {
    config,
    step: config.step,
    total: PROFILE_STEP_TOTAL,
    skippable: config.skippable,
    isValid,
    onBack,
    onContinue,
    onSkip,
    previewRoute: PROFILE_PREVIEW_ROUTE,
  };
}

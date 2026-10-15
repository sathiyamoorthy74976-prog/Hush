import { Redirect } from 'expo-router';

import { profileHref, PROFILE_FIRST_ROUTE } from '@/navigation/ProfileStack';

/** Legacy route — profile creation moved to /profile/*. */
export default function SignupScreen() {
  return <Redirect href={profileHref(PROFILE_FIRST_ROUTE)} />;
}

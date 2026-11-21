import { useAuth } from "./useAuth";
import { useProfile } from "./useProfile";

// The logged-in user, preferring the freshest copy (profile data is updated
// right after edits; auth.user is what we got at login).
export const useCurrentUser = () => {
  const { auth } = useAuth();
  const profile = useProfile();
  const profileUser = profile?.state?.user;
  return profileUser?.id === auth?.user?.id ? { ...auth.user, ...profileUser } : auth?.user;
};

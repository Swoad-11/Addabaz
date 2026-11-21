import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import { useProfile } from "../hooks/useProfile";
import { actions } from "../actions";
import ProfileInfo from "../components/profile/ProfileInfo";
import MyPosts from "../components/profile/MyPosts";
import { PostSkeleton } from "../components/posts/PostList";

function ProfileSkeleton() {
  return (
    <div aria-label="Loading profile">
      <div className="card overflow-hidden p-0 sm:p-0">
        <div className="skeleton h-40 rounded-none sm:h-52" />
        <div className="-mt-20 flex flex-col items-center gap-3 pb-8 sm:-mt-24">
          <div className="skeleton h-32 w-32 rounded-full ring-8 ring-ink-800 sm:h-40 sm:w-40" />
          <div className="skeleton h-6 w-48" />
          <div className="skeleton h-4 w-40" />
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-[640px]">
        <PostSkeleton />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { state, dispatch } = useProfile();
  const { api } = useAxios();
  const { auth } = useAuth();
  const userId = auth?.user?.id;

  useEffect(() => {
    let ignore = false;
    dispatch({ type: actions.profile.DATA_FETCHING });

    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profile/${userId}`);
        if (!ignore) dispatch({ type: actions.profile.DATA_FETCHED, data: response.data });
      } catch (error) {
        if (!ignore) {
          dispatch({
            type: actions.profile.DATA_FETCH_ERROR,
            error: error.response?.data?.error || error.message,
          });
        }
      }
    };

    fetchProfile();
    return () => {
      ignore = true;
    };
  }, [api, dispatch, userId]);

  if (state?.loading || (!state?.user && !state?.error)) return <ProfileSkeleton />;

  if (!state?.user) {
    return <div className="card mx-auto max-w-md text-center text-red-300">Could not load your profile.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <ProfileInfo />
      <MyPosts />
    </div>
  );
}

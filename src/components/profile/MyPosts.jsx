import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useProfile } from "../../hooks/useProfile";
import PostList from "../posts/PostList";

export default function MyPosts() {
  const { state } = useProfile();
  const { auth } = useAuth();
  const { api } = useAxios();
  const [posts, setPosts] = useState(state?.posts ?? []);

  // the profile is fetched by ProfilePage; follow it when it arrives
  useEffect(() => {
    setPosts(state?.posts ?? []);
  }, [state?.posts]);

  return (
    <div className="mx-auto max-w-[700px]">
      <h4 className="mb-6 mt-6 text-xl lg:mt-8 lg:text-2xl">Your Posts</h4>
      <PostList
        posts={posts}
        currentUser={auth?.user}
        api={api}
        onDeleted={(id) => setPosts((current) => current.filter((p) => p.id !== id))}
        emptyText="You haven't posted anything yet. Share something from the home page!"
      />
    </div>
  );
}

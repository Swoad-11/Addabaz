import useAxios from "../../hooks/useAxios";
import { useProfile } from "../../hooks/useProfile";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { actions } from "../../actions";
import PostList from "../posts/PostList";

export default function MyPosts() {
  const { state, dispatch } = useProfile();
  const user = useCurrentUser();
  const { api } = useAxios();
  const posts = state?.posts ?? [];

  const removePost = (id) =>
    dispatch({
      type: actions.profile.DATA_FETCHED,
      data: { user: state.user, posts: posts.filter((p) => p.id !== id), stats: state.stats },
    });

  return (
    <section className="mx-auto mt-8 max-w-[640px]">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        Your posts
        <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs font-semibold text-slate-400">
          {posts.length}
        </span>
      </h2>
      <PostList
        posts={posts}
        currentUser={user}
        api={api}
        onDeleted={removePost}
        emptyText="You haven't posted anything yet. Share your first post from the home page!"
      />
    </section>
  );
}

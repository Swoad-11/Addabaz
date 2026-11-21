/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Avatar from "../components/common/Avatar";
import { ArrowRightIcon, CommentIcon, HeartIcon, ImageIcon } from "../components/common/Icons";
import PostEntry from "../components/posts/PostEntry";
import PostList from "../components/posts/PostList";

function ProfileCard({ user, postCount }) {
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  return (
    <div className="card overflow-hidden p-0 sm:p-0">
      <div className="h-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_40%),linear-gradient(120deg,#2DD4A7,#38BDF8_60%,#8B5CF6)]" />
      <div className="-mt-9 flex flex-col items-center px-5 pb-5 text-center">
        <Avatar src={user?.avatar} name={fullName} className="h-[72px] w-[72px] ring-4 ring-ink-800" textClass="text-xl" />
        <h2 className="mt-3 font-bold">{fullName}</h2>
        <p className="truncate text-xs text-slate-500">{user?.email}</p>
        <div className="mt-4 grid w-full grid-cols-2 divide-x divide-white/[0.06] rounded-xl bg-white/[0.03] py-2.5 ring-1 ring-white/[0.06]">
          <div>
            <p className="text-lg font-bold">{postCount}</p>
            <p className="text-xs text-slate-500">Your posts</p>
          </div>
          <Link to="/me" className="group flex flex-col items-center justify-center text-sm font-semibold text-brand-300">
            Profile
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function TipsCard() {
  const tips = [
    { icon: ImageIcon, text: "Add a photo to make your post stand out", color: "text-emerald-300" },
    { icon: HeartIcon, text: "Like posts to show some love", color: "text-rose-300" },
    { icon: CommentIcon, text: "Join the conversation in the comments", color: "text-sky-300" },
  ];
  return (
    <div className="card">
      <h3 className="mb-3 text-sm font-semibold text-slate-300">Getting started</h3>
      <ul className="space-y-3">
        {tips.map(({ icon: Icon, text, color }) => (
          <li key={text} className="flex items-start gap-3 text-sm text-slate-400">
            <Icon className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${color}`} />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HomePage() {
  const user = useCurrentUser();
  const { api } = useAxios();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        if (!ignore) setPosts(response.data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.error || "Could not load posts.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchPosts();
    return () => {
      ignore = true;
    };
  }, [api]);

  const myPostCount = useMemo(
    () => posts.filter((p) => p.author?.id === user?.id).length,
    [posts, user?.id]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,640px)] lg:justify-center xl:grid-cols-[280px_minmax(0,640px)_280px]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-5">
          <ProfileCard user={user} postCount={myPostCount} />
        </div>
      </aside>

      <section>
        <PostEntry
          user={user}
          api={api}
          onCreated={(post) => setPosts((current) => [post, ...current])}
        />

        {error ? (
          <div className="card text-center text-red-300">{error}</div>
        ) : (
          <PostList
            loading={loading}
            posts={posts}
            currentUser={user}
            api={api}
            onDeleted={(id) => setPosts((current) => current.filter((p) => p.id !== id))}
            emptyText="No posts yet. Be the first to share something!"
          />
        )}
      </section>

      <aside className="hidden xl:block">
        <div className="sticky top-24">
          <TipsCard />
        </div>
      </aside>
    </div>
  );
}

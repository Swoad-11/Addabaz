/* eslint-disable react/prop-types */
import PostCard from "./PostCard";
import { SparklesIcon } from "../common/Icons";

export function PostSkeleton() {
  return (
    <div className="card mb-5" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="skeleton h-11 w-11 rounded-full" />
        <div className="space-y-2">
          <div className="skeleton h-3.5 w-32" />
          <div className="skeleton h-3 w-20" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3.5 w-full" />
        <div className="skeleton h-3.5 w-4/5" />
      </div>
      <div className="skeleton mt-4 h-48 w-full rounded-xl" />
    </div>
  );
}

export default function PostList({ posts, currentUser, api, onDeleted, emptyText, loading }) {
  if (loading) {
    return (
      <>
        <PostSkeleton />
        <PostSkeleton />
      </>
    );
  }

  if (!posts?.length) {
    return (
      <div className="card flex flex-col items-center gap-3 py-12 text-center">
        <span className="flex-center h-12 w-12 rounded-2xl bg-brand-400/10 text-brand-300">
          <SparklesIcon className="h-6 w-6" />
        </span>
        <p className="max-w-xs text-slate-400">{emptyText}</p>
      </div>
    );
  }

  return posts.map((post) => (
    <PostCard key={post.id} post={post} currentUser={currentUser} api={api} onDeleted={onDeleted} />
  ));
}

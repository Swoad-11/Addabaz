/* eslint-disable react/prop-types */
import { useState } from "react";
import Avatar from "../common/Avatar";
import { ClockIcon, CommentIcon, HeartIcon, SendIcon, TrashIcon } from "../common/Icons";
import { getImageUrl } from "../../utils/getImageUrl";
import { timeAgo } from "../../utils/timeAgo";

export default function PostCard({ post, currentUser, api, onDeleted }) {
  const [likes, setLikes] = useState(post.likes ?? []);
  const [comments, setComments] = useState(post.comments ?? []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  const userId = currentUser?.id;
  const liked = likes.includes(userId);
  const isAuthor = post.author?.id === userId;
  const imageUrl = getImageUrl(post.image, null);
  const myName = `${currentUser?.firstName ?? ""} ${currentUser?.lastName ?? ""}`.trim();

  const fail = (err, fallback) => setError(err.response?.data?.error || fallback);

  const toggleLike = async () => {
    // update right away, roll back if the request fails
    const previous = likes;
    setLikes(liked ? likes.filter((id) => id !== userId) : [...likes, userId]);
    try {
      await api.patch(`/posts/${post.id}/like`);
    } catch (err) {
      setLikes(previous);
      fail(err, "Could not update the like.");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await api.patch(`/posts/${post.id}/comment`, {
        comment: newComment.trim(),
      });
      setComments(response.data.comments);
      setNewComment("");
    } catch (err) {
      fail(err, "Could not add the comment.");
    } finally {
      setBusy(false);
    }
  };

  const deleteComment = async (commentId) => {
    setError("");
    try {
      const response = await api.delete(`/posts/${post.id}/comment/${commentId}`);
      setComments(response.data.comments);
    } catch (err) {
      fail(err, "Could not delete the comment.");
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    setError("");
    try {
      await api.delete(`/posts/${post.id}`);
      onDeleted?.(post.id);
    } catch (err) {
      fail(err, "Could not delete the post.");
    }
  };

  return (
    <article className="card mb-5 animate-fade-up p-0 sm:p-0">
      <header className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={post.author?.avatar} name={post.author?.name} className="h-11 w-11" />
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{post.author?.name}</h3>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <ClockIcon className="h-3.5 w-3.5" />
              {timeAgo(post.createAt)}
            </p>
          </div>
        </div>

        {isAuthor && (
          <button
            className="flex-center h-9 w-9 rounded-xl text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400"
            onClick={deletePost}
            aria-label="Delete post"
            title="Delete post"
          >
            <TrashIcon className="h-[18px] w-[18px]" />
          </button>
        )}
      </header>

      {post.content && (
        <p className="whitespace-pre-line break-words px-4 pt-3 text-[15px] leading-relaxed text-slate-200 sm:px-5">
          {post.content}
        </p>
      )}

      {imageUrl && !imageFailed && (
        <div className="mt-4 bg-black/20">
          <img
            className="max-h-[560px] w-full object-cover"
            src={imageUrl}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        </div>
      )}

      <div className="flex items-center justify-between px-4 pt-3 text-xs text-slate-500 sm:px-5">
        <span className="flex items-center gap-1.5">
          {likes.length > 0 && (
            <span className="flex-center h-5 w-5 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 text-white">
              <HeartIcon filled className="h-3 w-3" />
            </span>
          )}
          {likes.length} {likes.length === 1 ? "like" : "likes"}
        </span>
        <button className="hover:text-slate-300 hover:underline" onClick={() => setShowComments((v) => !v)}>
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </button>
      </div>

      <div className="mx-4 mt-3 grid grid-cols-2 gap-1 border-t border-white/[0.06] py-1.5 sm:mx-5">
        <button
          className={`flex-center gap-2 rounded-xl py-2 text-sm font-semibold transition-all hover:bg-white/[0.05] ${
            liked ? "text-rose-400" : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={toggleLike}
          aria-pressed={liked}
        >
          <HeartIcon filled={liked} className={`h-5 w-5 ${liked ? "scale-110" : ""} transition-transform`} />
          {liked ? "Liked" : "Like"}
        </button>
        <button
          className={`flex-center gap-2 rounded-xl py-2 text-sm font-semibold transition-all hover:bg-white/[0.05] ${
            showComments ? "text-sky-400" : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => setShowComments((v) => !v)}
          aria-expanded={showComments}
        >
          <CommentIcon className="h-5 w-5" />
          Comment
        </button>
      </div>

      {error && (
        <p className="mx-4 mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 sm:mx-5">{error}</p>
      )}

      {showComments && (
        <div className="border-t border-white/[0.06] px-4 py-4 sm:px-5">
          <form className="mb-4 flex items-center gap-3" onSubmit={addComment}>
            <Avatar src={currentUser?.avatar} name={myName} className="h-9 w-9" textClass="text-xs" />
            <div className="relative flex-1">
              <input
                className="h-10 w-full rounded-full border border-white/10 bg-white/[0.03] pl-4 pr-11 text-sm placeholder:text-slate-500 focus:border-brand-400/50 focus:outline-none focus:ring-4 focus:ring-brand-400/10"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={busy}
                maxLength={500}
              />
              <button
                type="submit"
                className="flex-center absolute right-1 top-1 h-8 w-8 rounded-full text-brand-300 transition-all hover:bg-brand-400/10 disabled:text-slate-600"
                disabled={!newComment.trim() || busy}
                aria-label="Send comment"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
          </form>

          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="group flex items-start gap-3">
                <Avatar src={c.author?.avatar} name={c.author?.name} className="h-8 w-8" textClass="text-[11px]" />
                <div className="min-w-0 flex-1">
                  <div className="inline-block max-w-full rounded-2xl rounded-tl-md bg-white/[0.05] px-3.5 py-2">
                    <p className="text-sm font-semibold">{c.author?.name}</p>
                    <p className="break-words text-sm text-slate-300">{c.comment}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-3 pl-2 text-xs text-slate-500">
                    <span>{timeAgo(c.createdAt)}</span>
                    {(isAuthor || c.author?.id === userId) && (
                      <button className="font-medium hover:text-red-400" onClick={() => deleteComment(c.id)}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {comments.length === 0 && (
              <li className="py-2 text-center text-sm text-slate-500">No comments yet. Start the conversation!</li>
            )}
          </ul>
        </div>
      )}
    </article>
  );
}

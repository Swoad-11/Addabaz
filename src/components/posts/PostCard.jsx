/* eslint-disable react/prop-types */
import { useState } from "react";
import LikeIcon from "../../assets/icons/like.svg";
import CommentIcon from "../../assets/icons/comment.svg";
import DeleteIcon from "../../assets/icons/delete.svg";
import TimeIcon from "../../assets/icons/time.svg";
import Avatar from "../common/Avatar";
import { getImageUrl } from "../../utils/getImageUrl";
import { timeAgo } from "../../utils/timeAgo";

export default function PostCard({ post, currentUser, api, onDeleted }) {
  const [likes, setLikes] = useState(post.likes ?? []);
  const [comments, setComments] = useState(post.comments ?? []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const userId = currentUser?.id;
  const liked = likes.includes(userId);
  const isAuthor = post.author?.id === userId;
  const imageUrl = getImageUrl(post.image, null);

  const fail = (err, fallback) =>
    setError(err.response?.data?.error || fallback);

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
    if (!newComment.trim()) return;
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
    if (!window.confirm("Delete this post?")) return;
    setError("");
    try {
      await api.delete(`/posts/${post.id}`);
      onDeleted?.(post.id);
    } catch (err) {
      fail(err, "Could not delete the post.");
    }
  };

  return (
    <article className="card mb-6 lg:mb-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={post.author?.avatar}
            alt={post.author?.name}
            className="post-avater h-10 w-10 lg:h-[58px] lg:w-[58px]"
          />
          <div>
            <h6 className="text-lg lg:text-xl">{post.author?.name}</h6>
            <div className="flex items-center gap-1.5">
              <img src={TimeIcon} alt="" />
              <span className="text-sm text-gray-400 lg:text-base">
                {timeAgo(post.createAt)}
              </span>
            </div>
          </div>
        </div>

        {isAuthor && (
          <button className="icon-btn" onClick={deletePost} aria-label="Delete post">
            <img src={DeleteIcon} alt="" />
          </button>
        )}
      </header>

      <div className="border-b border-[#3F3F3F] py-4 lg:py-5">
        {post.content && (
          <p className="whitespace-pre-line leading-[188%] text-gray-200 lg:text-lg">
            {post.content}
          </p>
        )}
        {imageUrl && (
          <img
            className="mt-4 max-h-[500px] w-full rounded-md object-cover"
            src={imageUrl}
            alt="Post"
            loading="lazy"
          />
        )}
      </div>

      <div className="flex items-center justify-between py-3 text-sm text-gray-400 lg:text-base">
        <span>
          {likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </span>
        <button className="hover:underline" onClick={() => setShowComments((v) => !v)}>
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </button>
      </div>

      <div className="grid grid-cols-2 border-y border-[#3F3F3F]">
        <button
          className={`flex-center gap-2 py-2.5 text-sm transition-all hover:bg-lighterDark lg:text-base ${
            liked ? "font-semibold text-lwsGreen" : "text-gray-300"
          }`}
          onClick={toggleLike}
        >
          <img src={LikeIcon} alt="" className={liked ? "" : "opacity-70"} />
          {liked ? "Liked" : "Like"}
        </button>
        <button
          className="flex-center gap-2 py-2.5 text-sm text-gray-300 transition-all hover:bg-lighterDark lg:text-base"
          onClick={() => setShowComments((v) => !v)}
        >
          <img src={CommentIcon} alt="" />
          Comment
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {showComments && (
        <div className="pt-4">
          <form className="mb-4 flex items-center gap-3" onSubmit={addComment}>
            <Avatar src={currentUser?.avatar} className="h-9 w-9 shrink-0" />
            <input
              className="h-9 w-full rounded-full bg-lighterDark px-4 text-sm focus:outline-none"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={busy}
            />
          </form>

          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="flex items-start gap-3">
                <Avatar src={c.author?.avatar} alt={c.author?.name} className="h-8 w-8 shrink-0" />
                <div className="flex-1 rounded-md bg-lighterDark px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{c.author?.name}</span>
                    <span className="text-xs text-gray-500">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-300">{c.comment}</p>
                </div>
                {(isAuthor || c.author?.id === userId) && (
                  <button
                    className="mt-1 text-xs text-gray-500 hover:text-red-500"
                    onClick={() => deleteComment(c.id)}
                    aria-label="Delete comment"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
            {comments.length === 0 && (
              <li className="text-sm text-gray-500">No comments yet.</li>
            )}
          </ul>
        </div>
      )}
    </article>
  );
}

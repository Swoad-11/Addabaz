/* eslint-disable react/prop-types */
import PostCard from "./PostCard";

export default function PostList({ posts, currentUser, api, onDeleted, emptyText }) {
  if (!posts?.length) {
    return <p className="card text-center text-gray-400">{emptyText}</p>;
  }

  return posts.map((post) => (
    <PostCard
      key={post.id}
      post={post}
      currentUser={currentUser}
      api={api}
      onDeleted={onDeleted}
    />
  ));
}

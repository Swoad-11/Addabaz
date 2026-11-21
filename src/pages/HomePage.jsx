import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import PostEntry from "../components/posts/PostEntry";
import PostList from "../components/posts/PostList";

export default function HomePage() {
  const { auth } = useAuth();
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
        if (!ignore) {
          setError(err.response?.data?.error || "Could not load posts.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPosts();
    return () => {
      ignore = true;
    };
  }, [api]);

  return (
    <div className="mx-auto max-w-[700px]">
      <PostEntry
        user={auth?.user}
        api={api}
        onCreated={(post) => setPosts((current) => [post, ...current])}
      />

      {loading && <p className="text-center text-gray-400">Loading posts...</p>}
      {error && <p className="card text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <PostList
          posts={posts}
          currentUser={auth?.user}
          api={api}
          onDeleted={(id) => setPosts((current) => current.filter((p) => p.id !== id))}
          emptyText="No posts yet. Be the first to share something!"
        />
      )}
    </div>
  );
}

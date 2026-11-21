/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import Avatar from "../common/Avatar";
import { CloseIcon, ImageIcon, SendIcon, Spinner } from "../common/Icons";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_LENGTH = 1000;

export default function PostEntry({ user, api, onCreated }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Images can be up to 4 MB.");
      return;
    }
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
  };

  const canPost = (content.trim() || image) && !submitting;

  const submit = async (e) => {
    e.preventDefault();
    if (!canPost) return;

    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("content", content.trim());
      if (image) formData.append("image", image);

      const response = await api.post("/posts", formData);
      onCreated(response.data);
      setContent("");
      clearImage();
    } catch (err) {
      setError(err.response?.data?.error || "Could not publish your post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card mb-6" onSubmit={submit}>
      <div className="flex gap-3 sm:gap-4">
        <Avatar src={user?.avatar} name={fullName} className="h-11 w-11" />
        <textarea
          className="min-h-[52px] w-full resize-none bg-transparent pt-2.5 text-[15px] text-slate-100 placeholder:text-slate-500 focus:outline-none"
          placeholder={`What's on your mind, ${user?.firstName ?? "friend"}?`}
          value={content}
          maxLength={MAX_LENGTH}
          rows={content.split("\n").length > 2 ? 5 : 2}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {preview && (
        <div className="relative mt-4 overflow-hidden rounded-xl ring-1 ring-white/10">
          <img className="max-h-96 w-full object-cover" src={preview} alt="Selected" />
          <button
            type="button"
            className="flex-center absolute right-3 top-3 h-9 w-9 rounded-full bg-ink-950/80 text-white backdrop-blur hover:bg-ink-950"
            onClick={clearImage}
            aria-label="Remove image"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <button
          type="button"
          className="btn-ghost px-3 text-emerald-300"
          onClick={() => fileRef.current.click()}
        >
          <ImageIcon className="h-[18px] w-[18px]" />
          <span className="text-slate-200">Photo</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickImage} />

        <div className="flex items-center gap-3">
          {content.length > MAX_LENGTH * 0.8 && (
            <span className="text-xs text-slate-500">
              {content.length}/{MAX_LENGTH}
            </span>
          )}
          <button type="submit" className="btn-primary px-5" disabled={!canPost}>
            {submitting ? <Spinner /> : <SendIcon className="h-4 w-4" />}
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}

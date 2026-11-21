/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import AddPhoto from "../../assets/icons/addPhoto.svg";
import CloseIcon from "../../assets/icons/close.svg";
import Avatar from "../common/Avatar";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export default function PostEntry({ user, api, onCreated }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image must be 4 MB or smaller.");
      return;
    }
    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

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
      setError(err.response?.data?.error || "Could not create the post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card mb-6" onSubmit={submit}>
      <div className="flex items-start gap-3 lg:gap-4">
        <Avatar src={user?.avatar} className="post-avater h-10 w-10 lg:h-[58px] lg:w-[58px]" />
        <textarea
          className="h-20 w-full resize-none rounded-md bg-lighterDark p-3 focus:outline-none lg:text-lg"
          placeholder={`What's on your mind, ${user?.firstName ?? "friend"}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {preview && (
        <div className="relative mt-4">
          <img className="max-h-80 w-full rounded-md object-cover" src={preview} alt="Selected" />
          <button
            type="button"
            className="icon-btn absolute right-2 top-2"
            onClick={clearImage}
            aria-label="Remove image"
          >
            <img src={CloseIcon} alt="" />
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="mt-4 flex items-center justify-between border-t border-[#3F3F3F] pt-4">
        <button
          type="button"
          className="btn-primary"
          onClick={() => fileRef.current.click()}
        >
          <img src={AddPhoto} alt="" />
          Add Photo
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickImage} />

        <button
          type="submit"
          className="rounded-md bg-lwsGreen px-6 py-2 text-sm font-bold text-deepDark transition-all hover:opacity-90 disabled:opacity-50 lg:text-base"
          disabled={submitting || (!content.trim() && !image)}
        >
          {submitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}

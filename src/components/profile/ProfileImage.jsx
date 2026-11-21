import { useRef, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { actions } from "../../actions";
import Avatar from "../common/Avatar";
import { CameraIcon, Spinner } from "../common/Icons";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const ProfileImage = () => {
  const { state, dispatch } = useProfile();
  const { auth, setAuth } = useAuth();
  const { api } = useAxios();
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const user = state?.user;
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Images can be up to 4 MB.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.post(`/profile/${user?.id}/avatar`, formData);
      dispatch({ type: actions.profile.IMAGE_UPDATED, data: response.data });
      // keep the header and composer in sync, also after a refresh
      setAuth({ ...auth, user: { ...auth.user, avatar: response.data.avatar } });
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative rounded-full bg-ink-950 p-1.5">
        <Avatar
          src={user?.avatar}
          name={fullName}
          className="h-32 w-32 sm:h-40 sm:w-40"
          textClass="text-4xl sm:text-5xl"
        />
        {uploading && (
          <div className="flex-center absolute inset-1.5 rounded-full bg-ink-950/70">
            <Spinner className="h-8 w-8 text-brand-300" />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => fileRef.current.click()}
        disabled={uploading}
        className="flex-center absolute bottom-2 right-2 h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-sky-400 text-ink-950 shadow-glow ring-4 ring-ink-950 transition-transform hover:scale-105 disabled:opacity-60"
        aria-label="Change profile picture"
        title="Change profile picture"
      >
        <CameraIcon className="h-5 w-5" />
      </button>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={upload} />
      {error && (
        <p className="absolute left-1/2 top-full mt-2 w-max max-w-[80vw] -translate-x-1/2 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
};

export default ProfileImage;

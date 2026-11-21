import { useState } from "react";
import { actions } from "../../actions";
import useAxios from "../../hooks/useAxios";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { CheckIcon, PencilIcon, Spinner } from "../common/Icons";

const MAX_LENGTH = 300;

const Bio = () => {
  const { state, dispatch } = useProfile();
  const { auth, setAuth } = useAuth();
  const { api } = useAxios();

  const savedBio = state?.user?.bio ?? "";
  const [bio, setBio] = useState(savedBio);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const startEditing = () => {
    setBio(savedBio);
    setError("");
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const response = await api.patch(`/profile/${state?.user?.id}`, { bio: bio.trim() });
      dispatch({ type: actions.profile.USER_DATA_EDITED, data: response.data });
      setAuth({ ...auth, user: { ...auth.user, bio: response.data.bio } });
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Could not save your bio.");
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="mx-auto mt-4 w-full max-w-xl">
        <textarea
          className="input min-h-[96px] resize-none text-center"
          value={bio}
          maxLength={MAX_LENGTH}
          autoFocus
          placeholder="Tell people a little about yourself"
          onChange={(e) => setBio(e.target.value)}
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {bio.length}/{MAX_LENGTH}
          </span>
          <div className="flex gap-2">
            <button className="btn-ghost px-3 py-2" onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn-primary px-4 py-2" onClick={save} disabled={saving}>
              {saving ? <Spinner /> : <CheckIcon className="h-4 w-4" />}
              Save
            </button>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 flex max-w-xl items-start justify-center gap-2">
      <p className={`leading-relaxed ${savedBio ? "text-slate-300" : "italic text-slate-500"}`}>
        {savedBio || "No bio yet. Add a few words about yourself."}
      </p>
      <button
        className="flex-center h-8 w-8 shrink-0 rounded-lg text-slate-400 transition-all hover:bg-white/[0.06] hover:text-white"
        onClick={startEditing}
        aria-label="Edit bio"
        title="Edit bio"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Bio;

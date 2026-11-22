/* eslint-disable react/prop-types */
import { useProfile } from "../../hooks/useProfile";
import { CommentIcon, HeartIcon, MailIcon, PencilIcon, SparklesIcon } from "../common/Icons";
import Bio from "./Bio";
import ProfileImage from "./ProfileImage";

const Stat = ({ value, label, icon: Icon, color }) => (
  <div className="flex flex-col items-center gap-1 px-4 py-3">
    <span className="flex items-center gap-1.5 text-xl font-bold">
      <Icon className={`h-4 w-4 ${color}`} />
      {value}
    </span>
    <span className="text-xs text-slate-500">{label}</span>
  </div>
);

const ProfileInfo = () => {
  const { state } = useProfile();
  const user = state?.user;
  const posts = state?.posts ?? [];
  const stats = state?.stats ?? {};

  // received counts follow the post list (so deleting a post updates them);
  // given/made counts come from the server, they include other people's posts
  const likesReceived = posts.reduce((sum, p) => sum + (p.likes?.length ?? 0), 0);

  return (
    <section className="card overflow-hidden p-0 sm:p-0">
      <div className="relative h-40 sm:h-52">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(255,255,255,0.28),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.55),transparent_45%),linear-gradient(120deg,#14B88F,#2DD4A7_30%,#38BDF8_65%,#6366F1)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-800/90 via-transparent to-transparent" />
      </div>

      <div className="relative -mt-20 flex flex-col items-center px-5 pb-6 text-center sm:-mt-24">
        <ProfileImage />
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {user?.firstName} {user?.lastName}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
          <MailIcon className="h-4 w-4" />
          {user?.email}
        </p>

        <Bio key={user?.bio ?? ""} />

        <div className="mt-6 grid w-full max-w-xl grid-cols-2 divide-white/[0.06] overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06] max-sm:divide-y sm:grid-cols-4 sm:divide-x">
          <Stat value={posts.length} label="Posts" icon={PencilIcon} color="text-brand-300" />
          <Stat value={stats.likesGiven ?? 0} label="Likes given" icon={HeartIcon} color="text-rose-400" />
          <Stat value={stats.commentsMade ?? 0} label="Comments made" icon={CommentIcon} color="text-sky-400" />
          <Stat value={likesReceived} label="Likes received" icon={SparklesIcon} color="text-amber-300" />
        </div>
      </div>
    </section>
  );
};

export default ProfileInfo;

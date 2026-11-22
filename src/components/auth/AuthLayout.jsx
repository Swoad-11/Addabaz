/* eslint-disable react/prop-types */
import Logo from "../common/Logo";
import { CommentIcon, HeartIcon, ImageIcon, SparklesIcon } from "../common/Icons";

const FEATURES = [
  { icon: ImageIcon, text: "Share posts and photos with everyone" },
  { icon: HeartIcon, text: "Like and comment on what friends share" },
  { icon: SparklesIcon, text: "Make your profile your own" },
];

// Decorative preview of a post for the brand panel
function PreviewCard() {
  return (
    <div className="card w-full max-w-sm animate-float border-white/10 bg-ink-800/80">
      <div className="flex items-center gap-3">
        <span className="flex-center h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold">
          AR
        </span>
        <div>
          <p className="text-sm font-semibold">Ayesha Rahman</p>
          <p className="text-xs text-slate-500">2 minutes ago</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-300">
        Sunset run by the river today. Who&apos;s joining tomorrow? 🌅
      </p>
      <div className="mt-3 h-28 rounded-xl bg-[radial-gradient(circle_at_30%_20%,#fbbf24,transparent_45%),linear-gradient(135deg,#f97316,#db2777_55%,#4c1d95)]" />
      <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-rose-400">
          <HeartIcon filled className="h-4 w-4" /> 128
        </span>
        <span className="flex items-center gap-1.5">
          <CommentIcon className="h-4 w-4" /> 24 comments
        </span>
      </div>
    </div>
  );
}

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden overflow-hidden border-r border-white/5 lg:flex lg:flex-col lg:gap-8 lg:px-12 lg:py-10 xl:px-16">
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />

        <Logo className="relative" />

        {/* fixed gaps between blocks, centred in whatever height is left */}
        <div className="relative my-auto flex flex-col gap-12">
        <div className="space-y-8">
          <div>
            <h1 className="max-w-lg text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
              Cha, golpo, <span className="text-gradient">adda.</span>
            </h1>
            <p className="mt-4 max-w-md text-slate-400">
              Addabaz is your daily adda, online. Share what is going on, react to friends and keep the conversation going.
            </p>
          </div>
          <ul className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-slate-300">
                <span className="flex-center h-9 w-9 rounded-xl bg-white/5 text-brand-300 ring-1 ring-white/10">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* decorative, so it's dropped on short screens instead of crowding the text */}
        <div className="[@media(max-height:700px)]:hidden">
          <PreviewCard />
        </div>
        </div>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md animate-fade-up">
          <Logo className="mb-8 lg:hidden" />
          <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
          <p className="mb-8 mt-2 text-slate-400">{subtitle}</p>
          <div className="card p-6 sm:p-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>}
        </div>
      </section>
    </main>
  );
}

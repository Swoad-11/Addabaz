import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import Avatar from "./Avatar";
import Logout from "../auth/Logout";
import { BellIcon, HomeIcon } from "./Icons";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const navClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
    isActive
      ? "bg-white/[0.08] text-white ring-1 ring-inset ring-white/10"
      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
  }`;

export default function Header() {
  const user = useCurrentUser();
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
      <div className="container flex h-16 max-w-6xl items-center justify-between gap-4">
        <Link to="/" aria-label="Addabaz home">
          <Logo />
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navClass}>
            <HomeIcon className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">Home</span>
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <button className="icon-btn relative" aria-label="Notifications">
            <BellIcon className="h-[18px] w-[18px]" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-400 ring-2 ring-ink-950" />
          </button>
          <Link
            to="/me"
            className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-1 transition-all hover:bg-white/[0.05] md:pr-3"
          >
            <Avatar src={user?.avatar} name={fullName} className="h-9 w-9" textClass="text-xs" />
            <span className="hidden max-w-[140px] truncate text-sm font-semibold md:inline">
              {fullName}
            </span>
          </Link>
          <Logout />
        </div>
      </div>
    </header>
  );
}

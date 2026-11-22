import { Link } from "react-router-dom";
import Logo from "./Logo";
import Avatar from "./Avatar";
import Logout from "../auth/Logout";
import { BellIcon } from "./Icons";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export default function Header() {
  const user = useCurrentUser();
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
      <div className="container flex h-16 max-w-6xl items-center justify-between gap-4">
        <Link to="/" aria-label="Addabaz home">
          <Logo />
        </Link>

        <div className="flex items-center gap-2">
          <button className="icon-btn" aria-label="Notifications (coming soon)" title="Notifications (coming soon)">
            <BellIcon className="h-[18px] w-[18px]" />
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

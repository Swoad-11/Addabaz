import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LogoutIcon } from "../common/Icons";

export default function Logout() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleLogout = () => {
    setAuth({});
    navigate("/login");
  };

  return (
    <button className="icon-btn hover:text-red-300" onClick={handleLogout} aria-label="Log out" title="Log out">
      <LogoutIcon className="h-[18px] w-[18px]" />
    </button>
  );
}

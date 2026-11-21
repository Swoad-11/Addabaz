import Header from "../components/common/Header";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import ProfileProvider from "../providers/ProfileProvider";

export default function PrivateRoutes() {
  const { auth } = useAuth();

  if (!auth?.authToken) return <Navigate to="/login" replace />;

  return (
    <ProfileProvider>
      <Header />
      <main className="container max-w-6xl py-6 sm:py-8">
        <Outlet />
      </main>
    </ProfileProvider>
  );
}

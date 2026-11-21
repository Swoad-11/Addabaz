import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import { HomeIcon } from "../components/common/Icons";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo className="mb-10" />
      <p className="text-gradient text-8xl font-extrabold tracking-tighter">404</p>
      <h1 className="mt-4 text-2xl font-bold">This page wandered off</h1>
      <p className="mt-2 max-w-sm text-slate-400">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-8 px-6">
        <HomeIcon className="h-4 w-4" />
        Back to home
      </Link>
    </main>
  );
}

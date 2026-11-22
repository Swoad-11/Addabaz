import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back 👋"
      subtitle="Sign in to see what your friends are sharing."
      footer={
        <>
          New to Addabaz?{" "}
          <Link to="/register" className="font-semibold text-brand-300 hover:text-brand-400 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}

import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import RegistrationForm from "../components/auth/RegistrationForm";

export default function RegistrationPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="It's free and only takes a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-300 hover:text-brand-400 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegistrationForm />
    </AuthLayout>
  );
}

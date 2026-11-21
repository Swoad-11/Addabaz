import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { SERVER_BASE_URL } from "../../api";
import AuthInput from "./AuthInput";
import { ArrowRightIcon, LockIcon, MailIcon, Spinner } from "../common/Icons";

export default function LoginForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const submitForm = async (formData) => {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/auth/login`, formData);
      const { user, token } = response.data;
      if (token) {
        setAuth({ user, authToken: token.token, refreshToken: token.refreshToken });
        navigate("/");
      }
    } catch (error) {
      const status = error.response?.status;
      setError("root.server", {
        type: "server",
        message:
          status === 404 || status === 401
            ? "Wrong email or password. Please try again."
            : error.response?.data?.error || "Could not reach the server. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} noValidate>
      <AuthInput
        id="email"
        label="Email"
        type="email"
        icon={MailIcon}
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email}
        {...register("email", { required: "Please enter your email" })}
      />

      <AuthInput
        id="password"
        label="Password"
        type="password"
        icon={LockIcon}
        placeholder="Your password"
        autoComplete="current-password"
        error={errors.password}
        {...register("password", {
          required: "Please enter your password",
          minLength: { value: 8, message: "Passwords are at least 8 characters" },
        })}
      />

      {errors?.root?.server && (
        <div role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errors.root.server.message}
        </div>
      )}

      <button type="submit" className="btn-primary w-full py-3 text-base" disabled={isSubmitting}>
        {isSubmitting ? <Spinner /> : null}
        {isSubmitting ? "Signing in..." : "Sign in"}
        {!isSubmitting && <ArrowRightIcon className="h-4 w-4" />}
      </button>
    </form>
  );
}

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { SERVER_BASE_URL } from "../../api";
import AuthInput from "./AuthInput";
import { ArrowRightIcon, LockIcon, MailIcon, Spinner, UserIcon } from "../common/Icons";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const submitForm = async (values) => {
    const { email, password, firstName, lastName } = values;
    const formData = { email, password, firstName, lastName };
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/auth/register`, formData);
      const { user, token } = response.data;
      setAuth({ user, authToken: token.token, refreshToken: token.refreshToken });
      navigate("/");
    } catch (error) {
      setError("root.server", {
        type: "server",
        message:
          error.response?.status === 409
            ? "An account with this email already exists. Try signing in."
            : error.response?.data?.error ||
              error.response?.data?.message ||
              "Could not reach the server. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} noValidate>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <AuthInput
          id="firstName"
          label="First name"
          icon={UserIcon}
          placeholder="Jane"
          autoComplete="given-name"
          error={errors.firstName}
          {...register("firstName", { required: "Required" })}
        />
        <AuthInput
          id="lastName"
          label="Last name"
          placeholder="Doe"
          autoComplete="family-name"
          error={errors.lastName}
          {...register("lastName", { required: "Required" })}
        />
      </div>

      <AuthInput
        id="email"
        label="Email"
        type="email"
        icon={MailIcon}
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email}
        {...register("email", {
          required: "Please enter your email",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "That doesn't look like an email" },
        })}
      />

      <AuthInput
        id="password"
        label="Password"
        type="password"
        icon={LockIcon}
        placeholder="At least 8 characters"
        autoComplete="new-password"
        error={errors.password}
        {...register("password", {
          required: "Please choose a password",
          minLength: { value: 8, message: "Use at least 8 characters" },
        })}
      />

      <AuthInput
        id="confirmPassword"
        label="Confirm password"
        type="password"
        icon={LockIcon}
        placeholder="Type it again"
        autoComplete="new-password"
        error={errors.confirmPassword}
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) => value === watch("password") || "Passwords don't match",
        })}
      />

      {errors?.root?.server && (
        <div role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errors.root.server.message}
        </div>
      )}

      <button type="submit" className="btn-primary w-full py-3 text-base" disabled={isSubmitting}>
        {isSubmitting ? <Spinner /> : null}
        {isSubmitting ? "Creating account..." : "Create account"}
        {!isSubmitting && <ArrowRightIcon className="h-4 w-4" />}
      </button>
    </form>
  );
}

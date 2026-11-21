import Field from "../common/Field";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { SERVER_BASE_URL } from "../../api";

export default function RegistrationForm() {
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
      const response = await axios.post(
        `${SERVER_BASE_URL}/auth/register`,
        formData
      );

      if (response.status === 201) {
        const { user, token } = response.data;
        setAuth({
          user,
          authToken: token.token,
          refreshToken: token.refreshToken,
        });
        navigate("/");
      }
    } catch (error) {
      setError("root.random", {
        type: "random",
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Could not reach the server. Please try again.",
      });
    }
  };

  const inputClass = (hasError) =>
    `auth-input ${hasError ? "border-red-500" : "border-gray-200"}`;

  return (
    <form
      className="border-b border-[#3F3F3F] pb-10 lg:pb-[30px]"
      onSubmit={handleSubmit(submitForm)}
    >
      <Field label="First Name" error={errors.firstName}>
        <input
          {...register("firstName", { required: "First name is required" })}
          className={inputClass(!!errors.firstName)}
          type="text"
          name="firstName"
          id="firstName"
        />
      </Field>

      <Field label="Last Name" error={errors.lastName}>
        <input
          {...register("lastName", { required: "Last name is required" })}
          className={inputClass(!!errors.lastName)}
          type="text"
          name="lastName"
          id="lastName"
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          {...register("email", { required: "Email ID is Required" })}
          className={inputClass(!!errors.email)}
          type="email"
          name="email"
          id="email"
        />
      </Field>

      <Field label="Password" error={errors.password}>
        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Your password must be at least 8 characters",
            },
          })}
          className={inputClass(!!errors.password)}
          type="password"
          name="password"
          id="password"
        />
      </Field>

      <p className="text-red-600">{errors?.root?.random?.message}</p>

      <Field>
        <button
          className="auth-input bg-lwsGreen font-bold text-deepDark transition-all hover:opacity-90 disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </Field>
    </form>
  );
}

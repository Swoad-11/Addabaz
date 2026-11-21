/* eslint-disable react/prop-types */
import { forwardRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "../common/Icons";

// Labelled input with a leading icon, error message and (for passwords)
// a show/hide toggle. Works with react-hook-form's register().
const AuthInput = forwardRef(function AuthInput(
  { id, label, icon: Icon, error, type = "text", ...props },
  ref
) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="form-control">
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        )}
        <input
          id={id}
          ref={ref}
          type={isPassword && visible ? "text" : type}
          aria-invalid={!!error}
          className={`input ${Icon ? "pl-11" : ""} ${isPassword ? "pr-11" : ""} ${
            error ? "input-error" : ""
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-slate-200"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOffIcon className="h-[18px] w-[18px]" /> : <EyeIcon className="h-[18px] w-[18px]" />}
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-xs font-medium text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
});

export default AuthInput;

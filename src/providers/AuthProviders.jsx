/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { AuthContext } from "../context";

const STORAGE_KEY = "addabaz-auth";
const OLD_STORAGE_KEY = "facehook-auth"; // before the rename

const loadAuth = () => {
  try {
    // read-only: React may call this more than once (StrictMode)
    const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(OLD_STORAGE_KEY);
    return JSON.parse(saved) || {};
  } catch {
    return {};
  }
};

const AuthProvider = ({ children }) => {
  // Kept in localStorage so a page refresh doesn't log the user out
  const [auth, setAuth] = useState(loadAuth);

  useEffect(() => {
    try {
      if (auth?.authToken) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      // the session now lives under the new key (or was logged out)
      localStorage.removeItem(OLD_STORAGE_KEY);
    } catch {
      // storage unavailable (private mode etc.): stay logged in for this tab only
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

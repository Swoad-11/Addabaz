/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { AuthContext } from "../context";

const STORAGE_KEY = "facehook-auth";

const loadAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
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

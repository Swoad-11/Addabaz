import { useContext, useDebugValue } from "react";
import { AuthContext } from "../context";

export const useAuth = () => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, (auth) =>
    auth?.user ? "User is logged in" : "User is logged out"
  );
  return useContext(AuthContext);
};

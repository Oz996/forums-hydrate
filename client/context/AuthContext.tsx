"use client";
import { ReactElement, useEffect, useState } from "react";
import { createContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  token: string | null;
  userId: string | null;
  handleLogin: (email: string, token: string, userId: string) => void;
  handleLogout: () => void;
}

const initialState: AuthContextType = {
  isAuthenticated: false,
  userEmail: null,
  token: null,
  userId: null,
  handleLogin: (email: string, token: string) => {},
  handleLogout: () => {},
};

export const AuthContext = createContext<AuthContextType>(initialState);

export const AuthContextProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    setIsAuthenticated(!!token || false);
    setToken(token);
    setUserId(userId);
    setUserEmail(email);
  }, [isAuthenticated]);

  const handleLogin = (email: string, token: string, userId: string) => {
    setIsAuthenticated(true);
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("userId", userId);
    console.log("id", userId);
    setToken(token);
    setUserId(userId);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUserEmail(null);
    setToken(null);
  };
  useEffect(() => {
    console.log(userEmail);
  }, [userEmail]);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        userId,
        handleLogin,
        handleLogout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

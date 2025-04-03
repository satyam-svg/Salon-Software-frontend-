"use client";

import { createContext, useContext, useState } from "react";

const LoginContext = createContext<{ loginToggle: boolean; setLoginToggle: (value: boolean) => void } | undefined>(undefined);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [loginToggle, setLoginToggle] = useState(false);

  return (
    <LoginContext.Provider value={{ loginToggle, setLoginToggle }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) throw new Error("useLogin must be used within a LoginProvider");
  return context;
};

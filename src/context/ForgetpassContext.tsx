"use client";

import { createContext, useContext, useState } from "react";

const ForgetPasswordContext = createContext<{ forgetPasswordToggle: boolean; setForgetPasswordToggle: (value: boolean) => void } | undefined>(undefined);

export const ForgetPasswordProvider = ({ children }: { children: React.ReactNode }) => {
  const [forgetPasswordToggle, setForgetPasswordToggle] = useState(false);

  return (
    <ForgetPasswordContext.Provider value={{ forgetPasswordToggle, setForgetPasswordToggle }}>
      {children}
    </ForgetPasswordContext.Provider>
  );
};

export const useForgetPassword = () => {
  const context = useContext(ForgetPasswordContext);
  if (!context) throw new Error("useForgetPassword must be used within a ForgetPasswordProvider");
  return context;
};

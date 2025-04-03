"use client"; // Ensure this runs on the client side

import { createContext, useContext, useState } from "react";

const SignupContext = createContext<{ signupToggle: boolean; setSignupToggle: (value: boolean) => void } | undefined>(undefined);

export const SignupProvider = ({ children }: { children: React.ReactNode }) => {
  const [signupToggle, setSignupToggle] = useState(false);

  return (
    <SignupContext.Provider value={{ signupToggle, setSignupToggle }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) throw new Error("useSignup must be used within a SignupProvider");
  return context;
};


"use client";

import { createContext, useContext, useState } from "react";

const ButtonLoaderContext = createContext<
  | {
      ButtonLoaderToggle: boolean;
      setButtonLoaderToggle: (value: boolean) => void;
    }
  | undefined
>(undefined);

export const ButtonLoaderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ButtonLoaderToggle, setButtonLoaderToggle] = useState(false);

  return (
    <ButtonLoaderContext.Provider
      value={{ ButtonLoaderToggle, setButtonLoaderToggle }}
    >
      {children}
    </ButtonLoaderContext.Provider>
  );
};

export const useButtonLoader = () => {
  const context = useContext(ButtonLoaderContext);
  if (!context)
    throw new Error("useButtonLoader must be used within a LoginProvider");
  return context;
};

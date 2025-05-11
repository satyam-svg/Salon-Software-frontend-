"use client";

import { createContext, useContext, useState } from "react";

const ScreenLoaderContext = createContext<
  | {
      ScreenLoaderToggle: boolean;
      setScreenLoaderToggle: (value: boolean) => void;
    }
  | undefined
>(undefined);

export const ScreenLoaderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ScreenLoaderToggle, setScreenLoaderToggle] = useState(false);

  return (
    <ScreenLoaderContext.Provider
      value={{ ScreenLoaderToggle, setScreenLoaderToggle }}
    >
      {children}
    </ScreenLoaderContext.Provider>
  );
};

export const useScreenLoader = () => {
  const context = useContext(ScreenLoaderContext);
  if (!context)
    throw new Error("useScreenLoader must be used within a LoginProvider");
  return context;
};

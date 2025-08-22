import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface OnlineStatusContextType {
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export const useOnlineStatus = () => {
  const context = useContext(OnlineStatusContext);
  if (!context) {
    throw new Error("useOnlineStatus must be used within OnlineStatusProvider");
  }
  return context;
};

export const OnlineStatusProvider = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnlineState] = useState(() => {
    const stored = localStorage.getItem("user-online-status");
    return stored ? JSON.parse(stored) : true;
  });

  const setIsOnline = (status: boolean) => {
    setIsOnlineState(status);
    localStorage.setItem("user-online-status", JSON.stringify(status));
  };

  useEffect(() => {
    localStorage.setItem("user-online-status", JSON.stringify(isOnline));
  }, [isOnline]);

  return (
    <OnlineStatusContext.Provider value={{ isOnline, setIsOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};
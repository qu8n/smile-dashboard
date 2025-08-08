import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type PhiEnabledContextType = {
  phiEnabled: boolean;
  setPhiEnabled: Dispatch<SetStateAction<boolean>>;
};

const PhiEnabledContext = createContext<PhiEnabledContextType | undefined>(
  undefined
);

export function PhiEnabledProvider({ children }: { children: ReactNode }) {
  const [phiEnabled, setPhiEnabled] = useState<boolean>(false);

  return (
    <PhiEnabledContext.Provider value={{ phiEnabled, setPhiEnabled }}>
      {children}
    </PhiEnabledContext.Provider>
  );
}

export function usePhiEnabled(): PhiEnabledContextType {
  const phiEnabledContext = useContext(PhiEnabledContext);
  if (!phiEnabledContext) {
    throw new Error(
      "usePhiEnabled hook must be used within a PhiEnabledProvider component"
    );
  }
  return phiEnabledContext;
}

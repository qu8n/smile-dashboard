import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { getUserEmail } from "../utils/getUserEmail";
import { useUserEmail } from "./UserEmailContext";
import { openLoginPopup } from "../utils/openLoginPopup";
import { useWarningModal } from "./WarningContext";
import { PHI_WARNING } from "../config";

type PhiEnabledContextType = {
  phiEnabled: boolean;
  setPhiEnabled: Dispatch<SetStateAction<boolean>>;
};

const PhiEnabledContext = createContext<PhiEnabledContextType | undefined>(
  undefined
);

export function PhiEnabledProvider({ children }: { children: ReactNode }) {
  const [phiEnabled, setPhiEnabled] = useState<boolean>(false);
  const { userEmail, setUserEmail } = useUserEmail();
  const { setWarningModalContent } = useWarningModal();

  useEffect(() => {
    async function handleLogin(event: MessageEvent) {
      if (event.data !== "success") return;
      setUserEmail(await getUserEmail());
      setWarningModalContent(PHI_WARNING);
    }
    if (phiEnabled) {
      window.addEventListener("message", handleLogin);
      if (!userEmail) openLoginPopup();
      return () => {
        window.removeEventListener("message", handleLogin);
      };
    }
  }, [phiEnabled, userEmail, setUserEmail, setWarningModalContent]);

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

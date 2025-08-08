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

const PHI_WARNING =
  "The information contained in this transmission from Memorial Sloan-Kettering" +
  " Cancer Center is privileged, confidential and protected health" +
  " information (PHI) and it is protected from disclosure under applicable" +
  " law, including the Health Insurance Portability and Accountability Act" +
  " of 1996, as amended (HIPAA). This transmission is intended for the sole" +
  " use of approved individuals with permission and training to access this" +
  " information and PHI. You are notified that your access to this" +
  " transmission is logged. If you have received this transmission in" +
  " error, please immediately delete this information and any attachments" +
  " from any computer.";

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

  useEffect(() => {
    async function handleLogin(event: MessageEvent) {
      if (event.data !== "success") return;
      setUserEmail(await getUserEmail());
      // TODO: make this a global state?
      // setAlertContent(PHI_WARNING.content);
    }
    if (phiEnabled) {
      window.addEventListener("message", handleLogin);
      if (!userEmail) openLoginPopup();
      return () => {
        window.removeEventListener("message", handleLogin);
      };
    }
  }, [phiEnabled, userEmail, setUserEmail]);

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

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AlertContextType = {
  alertContent: string | undefined;
  setAlertContent: Dispatch<SetStateAction<string | undefined>>;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alertContent, setAlertContent] = useState<string | undefined>(
    undefined
  );

  return (
    <AlertContext.Provider value={{ alertContent, setAlertContent }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextType {
  const alertContext = useContext(AlertContext);
  if (!alertContext) {
    throw new Error(
      "useAlert hook must be used within an AlertProvider component"
    );
  }
  return alertContext;
}

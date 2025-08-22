import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type WarningModalContextType = {
  warningModalContent: string | undefined;
  setWarningModalContent: Dispatch<SetStateAction<string | undefined>>;
};

const WarningModalContext = createContext<WarningModalContextType | undefined>(
  undefined
);

export function WarningModalProvider({ children }: { children: ReactNode }) {
  const [warningModalContent, setWarningModalContent] = useState<
    string | undefined
  >(undefined);

  return (
    <WarningModalContext.Provider
      value={{ warningModalContent, setWarningModalContent }}
    >
      {children}
    </WarningModalContext.Provider>
  );
}

export function useWarningModal(): WarningModalContextType {
  const warningModalContext = useContext(WarningModalContext);
  if (!warningModalContext) {
    throw new Error(
      "useWarningModal hook must be used within a WarningModalProvider component"
    );
  }
  return warningModalContext;
}

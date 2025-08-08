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

type UserEmailContextType = {
  userEmail: string | undefined;
  setUserEmail: Dispatch<SetStateAction<string | undefined>>;
};

const UserEmailContext = createContext<UserEmailContextType | undefined>(
  undefined
);

export function UserEmailProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function getAndSetUserEmail() {
      const currentUserEmail = await getUserEmail();
      setUserEmail(currentUserEmail);
    }
    getAndSetUserEmail();
  }, []);

  return (
    <UserEmailContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserEmailContext.Provider>
  );
}

export function useUserEmail(): UserEmailContextType {
  const userEmailContext = useContext(UserEmailContext);
  if (!userEmailContext) {
    throw new Error(
      "useUserEmail hook must be used within a UserEmailProvider component"
    );
  }
  return userEmailContext;
}

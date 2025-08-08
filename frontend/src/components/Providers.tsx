import { ReactNode } from "react";
import { AlertProvider } from "../contexts/AlertContext";
import { PhiEnabledProvider } from "../contexts/PhiEnabledContext";
import { UserEmailProvider } from "../contexts/UserEmailContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PhiEnabledProvider>
      <UserEmailProvider>
        <AlertProvider>{children}</AlertProvider>
      </UserEmailProvider>
    </PhiEnabledProvider>
  );
}

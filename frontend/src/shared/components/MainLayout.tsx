import { ReactNode } from "react";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="d-flex flex-column"
      style={{ height: "calc(100vh - 100px)" }}
    >
      {children}
    </div>
  );
}

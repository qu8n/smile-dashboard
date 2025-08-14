import { ReactNode } from "react";

/**
 * Layout component for pages that contain a data grid (<DataGrid />).
 * Provide a flex column container that takes the full height of the viewport
 * minus the navbar, allowing us to fill the available space with the data grid
 * without having to set a specific height for it.
 */
export function DataGridLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="d-flex flex-column"
      style={{ height: "calc(100vh - 100px)" }}
    >
      {children}
    </div>
  );
}

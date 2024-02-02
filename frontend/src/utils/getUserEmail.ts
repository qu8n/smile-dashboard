import React from "react";
import { REACT_APP_EXPRESS_SERVER_ORIGIN } from "../shared/constants";

/**
 * Fetches the user email to be displayed in the navbar. This function gets called
 * when the user first logs in and upon each initial render.
 * @param setUserEmail - React state setter function to set the user email
 */
export async function getUserEmail(
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>
) {
  try {
    const response = await fetch(
      `${REACT_APP_EXPRESS_SERVER_ORIGIN}/auth/get-user-email`,
      {
        credentials: "include",
      }
    );

    if (response.status === 200) {
      const userEmail = await response.text();
      setUserEmail(userEmail);
    }
  } catch (error) {
    console.error(error);
  }
}

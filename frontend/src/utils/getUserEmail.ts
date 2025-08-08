export async function getUserEmail() {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_EXPRESS_SERVER_ORIGIN}/auth/get-user-email`,
      {
        credentials: "include",
      }
    );

    if (response.status === 200) {
      const userEmail = await response.text();
      return userEmail;
    }
  } catch (error) {
    console.error(error);
  }

  return undefined;
}

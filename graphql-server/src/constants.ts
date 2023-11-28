export const EXPRESS_SERVER_ORIGIN =
  process.env.EXPRESS_SERVER_ORIGIN === undefined
    ? "https://localhost:4000"
    : process.env.EXPRESS_SERVER_ORIGIN;

export const REACT_SERVER_ORIGIN =
  process.env.REACT_SERVER_ORIGIN === undefined
    ? "https://localhost:3006"
    : process.env.REACT_SERVER_ORIGIN;

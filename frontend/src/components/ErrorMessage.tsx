import { ApolloError } from "@apollo/client";

export function ErrorMessage({ error }: { error: ApolloError }) {
  return (
    <div>
      <p>There was an error loading data. Please try refreshing the page.</p>
      <p>
        If the error persists, send SMILE team (1) steps to trigger this error
        and (2) the error message below:
      </p>
      <i>
        {error.name} - {error.message}
      </i>
    </div>
  );
}

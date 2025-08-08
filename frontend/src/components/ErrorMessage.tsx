import { ApolloError } from "@apollo/client";

export function ErrorMessage({ error }: { error: ApolloError }) {
  return (
    <div>
      <p>There was an error loading data. Please try refreshing the page.</p>
      <p>If the error persists, contact SMILE team and share this error:</p>
      <i>
        {error.name} - {error.message}
      </i>
    </div>
  );
}

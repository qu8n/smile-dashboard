import { UpdateSamplesMutationVariables } from "./generated/graphql";

export const resolvers = {
  Mutation: {
    updateSamples: async (
      _source: any,
      { where, update }: UpdateSamplesMutationVariables
    ) => {
      console.log("\n updateSamplesMutation resolver w/args");
      console.log("\n", where);
      console.log("\n", update);

      return null;
    },
  },
};

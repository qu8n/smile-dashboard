import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import { IMiddlewareResolver } from "graphql-middleware/dist/types";
import { ExecuteStatementOptions } from "@databricks/sql/dist/contracts/IDBSQLSession";
import { queryDatabricks } from "../utils/databricks";

const KEYCLOAK_PHI_ACCESS_GROUP = "mrn-search";

export async function buildDatabricksSchema() {
  const authenticationMiddleware: {
    Query: {
      patientIdsTriplets: IMiddlewareResolver;
    };
  } = {
    Query: {
      patientIdsTriplets: async (resolve, parent, args, context, info) => {
        const req = context.req;

        if (req.isAuthenticated()) {
          // continues to the next middleware or resolver
          const result = await resolve(parent, args, context, info);
          return result;
        } else {
          throw new AuthenticationError("401");
        }
      },
    },
  };

  const authorizationMiddleware: {
    Query: {
      patientIdsTriplets: IMiddlewareResolver;
    };
  } = {
    Query: {
      patientIdsTriplets: async (resolve, parent, args, context, info) => {
        const req = context.req;

        if (req.user.groups.includes(KEYCLOAK_PHI_ACCESS_GROUP)) {
          // continues to the next middleware or resolver
          const result = await resolve(parent, args, context, info);
          return result;
        } else {
          throw new ForbiddenError("403");
        }
      },
    },
  };

  const resolvers = {
    Query: {
      patientIdsTriplets: async (
        _: any,
        { patientIds }: { patientIds: Array<String> }
      ) => {
        try {
          const patientIdList = patientIds
            .map((patientId) => `'${patientId}'`)
            .join(",");
          const query = `
            SELECT CMO_ID, DMP_ID, PT_MRN
            FROM src_crdb_prod.crdb.crdb_cmo_loj_dmp_map
            WHERE DMP_ID IN (${patientIdList})
              OR PT_MRN IN (${patientIdList})
              OR CMO_ID IN (${patientIdList})
          `;
          const queryOptions = { runAsync: true } as ExecuteStatementOptions;
          const res = await queryDatabricks({ query, queryOptions });
          return res;
        } catch (error) {
          console.error("Error querying Patient ID triplets:", error);
          return [];
        }
      },
    },
  };

  const typeDefs = `
    type PatientIdsTriplet {
      CMO_ID: String!
      DMP_ID: String
      PT_MRN: String!
    }

    type Query {
      patientIdsTriplets(patientIds: [String!]!): [PatientIdsTriplet]
    }
  `;

  const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
  });

  return applyMiddleware(
    schema,
    authenticationMiddleware,
    authorizationMiddleware
  );
}

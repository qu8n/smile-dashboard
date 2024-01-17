import os from "os";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { buildProps } from "../utils/buildProps";
import { applyMiddleware } from "graphql-middleware";
import { IMiddlewareResolver } from "graphql-middleware/dist/types";

// The CRDB implements case insensitive logon, a setting that requires node-oracledb's Thick mode
// and the Oracle Instant Client, which is unavailable for M1 Macs
let oracledb: any = null;
if (os.arch() !== "arm64") {
  oracledb = require("oracledb");
  oracledb.initOracleClient();
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // returns each row as a JS object
}

const props = buildProps();

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

      if (req.user.groups.includes("mrn-search")) {
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
    patientIdsTriplets: async (_: any, { patientIds }: any) => {
      // TODO remove before finalizing PR. Dummy data for testing
      const patientIdsTriplets = [
        {
          DMP_ID: "P-1234567",
          CMO_ID: "4PJHNV",
          PT_MRN: "12345678",
        },
        {
          DMP_ID: "P-3456789",
          CMO_ID: "YYTNU8",
          PT_MRN: "34567890",
        },
      ];

      if (os.arch() !== "arm64" && oracledb !== null) {
        try {
          const connection = await oracledb.getConnection({
            user: props.oracle_user,
            password: props.oracle_password,
            connectString: props.oracle_connect_string,
          });

          const promises = patientIds.map(async (patientId: string) => {
            const result = await connection.execute(
              "SELECT CMO_ID, DMP_ID, PT_MRN FROM CRDB_CMO_LOJ_DMP_MAP WHERE :patientId IN (DMP_ID, PT_MRN, CMO_ID)",
              { patientId }
            );
            if (result.rows.length > 0) {
              return result.rows[0];
            }
          });

          patientIdsTriplets.push(...(await Promise.all(promises)));
          await connection.close();
        } catch (error) {
          console.error("Error in OracleDB connection: ", error);
        }
      }

      return patientIdsTriplets;
    },
  },
};

const typeDefs = `
  type PatientIdsTriplet {
    CMO_ID: String
    DMP_ID: String
    PT_MRN: String
  }

  type Query {
    patientIdsTriplets(patientIds: [String!]!): [PatientIdsTriplet]
  }
`;

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

export const oracleDbSchema = applyMiddleware(
  schema,
  authenticationMiddleware,
  authorizationMiddleware
);

/* eslint-disable @typescript-eslint/no-explicit-any */
// // Provide a minimal ambient declaration for the mongodb adapter path so TypeScript
// // does not error when the package doesn't provide its own types.
// declare module "better-auth/adapters/mongodb" {
//   import { Db, MongoClient } from "mongodb";
//   export function mongodbAdapter(db: Db, options?: { client?: MongoClient } | any): any;
// }

import { betterAuth } from "better-auth";
import { MongoClient, ServerApiVersion, Db } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

// Declare global variable augmentation for hot-reloading stability in development
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGO_DB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Please add your MONGO_DB_URI to .env file");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

const connectedClient: MongoClient = await clientPromise;
const db: Db = connectedClient.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db, { client: connectedClient }),

  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  user: {
    additionalFields: {
      role: { type: "string", default: "user" },
      plan: { type: "string", default: "user_free" },
      isBlocked: { type: "boolean", default: false },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user: Record<string, any>) => {
          return {
            data: {
              ...user,
              role: user.role || "user",
              plan: user.plan || "user_free",
              isBlocked: user.isBlocked ?? false,
            },
          };
        },
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 5 * 24 * 60 * 60, // 5 Days
    },
  },
  
  plugins: [
    jwt()
  ],
});
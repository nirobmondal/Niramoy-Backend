import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { envVars } from "../config/env";
import { prisma } from "./prisma";
import { Role } from "../../generated/prisma/enums";

export const auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent",
      mapProfileToUser: () => {
        return {
          role: Role.CUSTOMER,
          isBanned: false,
        };
      },
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.CUSTOMER,
      },
      isBanned: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      address: {
        type: "string",
        required: false,
      },
    },
  },

  redirectURLs: {
    signIn: `${envVars.FRONTEND_URL}/api/v1/auth/google/success`,
  },

  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:5000",
    envVars.FRONTEND_URL,
  ],

  // advanced: {
  //   // disableCSRFCheck: true,
  //   useSecureCookies: false,
  //   cookies: {
  //     state: {
  //       attributes: {
  //         sameSite: "none",
  //         secure: true,
  //         httpOnly: true,
  //         path: "/",
  //       },
  //     },
  //     sessionToken: {
  //       attributes: {
  //         sameSite: "none",
  //         secure: true,
  //         httpOnly: true,
  //         path: "/",
  //       },
  //     },
  //   },
  // },
});

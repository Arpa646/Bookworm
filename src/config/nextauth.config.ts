/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import nexiosInstance from "./nexios.config";

export const AuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: "85401385414-h4m4eicsvahull3tvap3rhfqmd89tgsl.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],

  callbacks: {
    async signIn({ profile, account }: any) {
      try {
        console.log({ profile, account });

        if (!profile || !account) {
          return false;
        }

        if (account?.provider === "google") {
          const response: any = await nexiosInstance.post("/auth/login", {
            name: profile.name,
            email: profile.email,
            img: profile.picture,
          });

          if (
            response.data.data.accessToken ||
            response.data.data.refreshToken
          ) {
            cookies().set("accessToken", response.data.data.accessToken);
            cookies().set("refreshToken", response.data.data.refreshToken);
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: "secret" as string,
};

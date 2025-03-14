import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import { DefaultSession, NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      googleAccount: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    googleAccount: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password || ""))) {
          throw new Error("Invalid email or password.");
        }

        // Ensure the `googleAccount` flag is set to `false` for non-Google users
        if (!user.googleAccount) {
          await prisma.user.update({
            where: { email },
            data: { googleAccount: false },
          });
        }

        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await prisma.user.upsert({
          where: { email: user.email as string },
          update: { googleAccount: true },
          create: {
            email: user.email || "",
            name: user.name || "User",
            googleAccount: true,
          },
        });
      }
      return true;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.googleAccount = token.googleAccount as boolean;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.googleAccount = user.googleAccount || false;
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

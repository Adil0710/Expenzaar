import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import type { DefaultSession, NextAuthOptions } from "next-auth";

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
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            throw new Error("Invalid email or password.");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!passwordMatch) {
            throw new Error("Invalid email or password.");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            googleAccount: user.googleAccount || false,
          };
        } catch (error) {
            console.log(error)
          throw new Error("Authentication failed.");
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (existingUser) {
          // If existing user exists but wasn't marked as Google, update it
          if (!existingUser.googleAccount) {
            await prisma.user.update({
              where: { email: user.email as string },
              data: { googleAccount: true },
            });
          }
        } else {
          // If no user exists, create a new entry for Google login
          await prisma.user.create({
            data: {
              email: user.email || "",
              name: user.name || "User",
              googleAccount: true,
            },
          });
        }

        return true;
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

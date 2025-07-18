import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import db from "./db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import "next-auth";

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is not set");
}

const credentialsSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validate credentials with zod.
          const result = credentialsSchema.safeParse(credentials);
          if (!result.success) {
            throw new Error(result.error.errors[0].message);
          }

          const { email, password } = result.data;
          const normalisedEmail = email.toLowerCase();

          // Find user by email.
          const user = await db.user.findUnique({
            where: { email: normalisedEmail },
            select: {
              id: true,
              email: true,
              password: true,
              loginAttempts: true,
              lastLoginAttempt: true,
            },
          });

          // Basic rate limiting at application level.
          const FIVE_MINUTES_AGO = new Date(Date.now() - 5 * 60 * 1000);
          if (
            user?.loginAttempts > 8 &&
            user.lastLoginAttempt > FIVE_MINUTES_AGO
          ) {
            throw new Error("Account locked. Try again in 5 minutes.");
          }

          // Handle user not found or OAuth account.
          if (!user || !user.password) {
            await db.user.update({
              where: { email: normalisedEmail },
              data: {
                loginAttempts: { increment: 1 },
                lastLoginAttempt: new Date(),
              },
            });
            throw new Error("Invalid credentials");
          }

          // Timing-safe comparison.

          // Verify password.
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            await db.user.update({
              where: { id: user.id },
              data: {
                loginAttempts: { increment: 1 },
                lastLoginAttempt: new Date(),
              },
            });
            throw new Error("Invalid credentials");
          }

          // Reset login attempts on successful login.
          await db.user.update({
            where: { id: user.id },
            data: { loginAttempts: 0 },
          });

          // Return sanitised user object without password.
          return {
            id: user.id,
            email: user.email,
          };
        } catch (error) {
          console.error(
            "Authentication error:",
            error instanceof Error ? error.message : "Unknown error"
          );
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist user data in JWT.
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  cookies: {
    sessionToken: {
      name: `__Secure-authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.AUTH_SECRET,
});

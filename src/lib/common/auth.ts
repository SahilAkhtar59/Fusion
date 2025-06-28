import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";

export const { auth, handlers, signIn } = NextAuth({ providers: [Google, Discord, Credentials({
    credentials: {
        email: {},
        password: {},
    },
    authorize
})] });

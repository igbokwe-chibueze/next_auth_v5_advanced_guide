import NextAuth, { DefaultSession } from "next-auth"
import { authConfig } from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import { getUserById } from "@/data/user"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
    interface Session {
      user: {
        role: UserRole;
      } & DefaultSession["user"]
    }
  }

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
        signOut: "/auth/login",
    },
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            })
        },
    },
    callbacks: {
        async session({ token, session }) {
            
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            

            if (!existingUser) return token;
            
            token.role = existingUser.role;

            return token
        },
    },
    adapter: PrismaAdapter(prisma),
    // This strategy stores session data in a JWT rather than in a database due to edge compatability.
    session: {
        strategy: "jwt",
    },
    ...authConfig
})
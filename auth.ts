import NextAuth, { DefaultSession } from "next-auth"
import { authConfig } from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import { getUserById } from "@/data/user"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"

declare module "next-auth" {
    interface Session {
      user: {
        role: UserRole;
        isTwoFactorEnabled?: boolean;
        isOAuth?: boolean;
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
        async signIn({ user, account }) {
            //Allow OAuth without email verification
            if (account?.provider !== "credentials" ) return true;

            const existingUser = await getUserById(user.id!);

            //prevent sign in without email verification
            if (!existingUser?.emailVerified) return false;

            //2FA check
            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

                if (!twoFactorConfirmation) return false;

                // Delete two factor confirmation, so every signIn undergoes 2FA check
                await prisma.twoFactorConfirmation.delete(
                    { where: { id: twoFactorConfirmation.id } }
                )
            }

            return true;
        },
        async session({ token, session }) {
            
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            

            if (!existingUser) return token;
            
            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

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
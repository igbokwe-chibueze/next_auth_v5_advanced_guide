import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    // This strategy stores session data in a JWT rather than in a database due to edge compatability.
    session: {
        strategy: "jwt",
    },
    ...authConfig
})
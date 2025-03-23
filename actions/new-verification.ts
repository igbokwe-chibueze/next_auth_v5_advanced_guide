"use server";

import { getVerificationTokenByToken } from "@/data/verification-token";
import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/data/user";

// A better naming condition would have been to call this verifyEmail or emailVerification
export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: "Invalid credentials!*no token" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await getUserByEmail(existingToken.email);
    

    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    await prisma.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email, //useful when user wants to update their email.
        },
    });

    await prisma.verificationTokenCustom.delete({
        where: {
            id: existingToken.id,
        },
    });

    return { success: "Email verified!" };
};

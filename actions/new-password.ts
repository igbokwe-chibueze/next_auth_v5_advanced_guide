"use server";

import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/reset-password-token";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/data/user";
import { sendPasswordChangeConfirmationEmail } from "@/lib/mail";

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token: string) => {
    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { password } = validatedFields.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: "Invalid token!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "Invalid Credentials!*Email does not exist!" };
    }

    // Check if the new password is the same as the current password.
    const isSamePassword = await bcrypt.compare(password, existingUser.password!);
    if (isSamePassword) {
        return { error: "You cannot use the same password. Please choose a new one." };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            password: hashedPassword,
            passwordChangedAt: new Date(), // Update passwordChangedAt here
        },
    });

    await prisma.passwordResetToken.delete({
        where: {
            id: existingToken.id,
        },
    });

    await sendPasswordChangeConfirmationEmail(existingUser.email);

    return { success: "Password updated! Return to login" };
};

"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { SettingsSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserByEmail, getUserById } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();

    if (!user || !user.id) {
        return { error: "Unauthorized!" };
    }

    const dbUser = await getUserById(user.id);
    

    if (!dbUser) {
        return { error: "Unauthorized!" };
    }

    if (user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.confirmNewPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in use!" };
        };

        const verificationToken = await generateVerificationToken(values.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Verification email sent!" };
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(values.password, dbUser.password);

        if (!passwordMatch) {
            return { error: "Invalid password!" };
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        values.password = hashedPassword;
        values.newPassword = undefined;
        values.confirmNewPassword = undefined;
    }

    await prisma.user.update({
        where: {
            id: dbUser.id,
        },
        data: {
            ...values,
        },
    });
    
    return { success: "Settings Updated!" };
};

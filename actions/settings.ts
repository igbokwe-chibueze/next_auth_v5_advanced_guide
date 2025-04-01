"use server"; // Ensure this code is executed on the server side.

import * as z from "zod";
import bcrypt from "bcryptjs";

// Import the schema for validating settings form values.
import { SettingsSchema } from "@/schemas";
// Import helper to get the currently authenticated user.
import { currentUser } from "@/lib/auth";
// Import Prisma client for database operations.
import { prisma } from "@/lib/prisma";
// Import functions to retrieve user data from the database.
import { getUserByEmail, getUserById } from "@/data/user";
// Import functions for generating verification tokens and sending emails.
import { generateVerificationToken } from "@/lib/tokens";
import { sendPasswordChangeConfirmationEmail, sendVerificationEmail } from "@/lib/mail";

/**
 * Updates the user settings based on the provided form values.
 *
 * This function validates and processes the settings update:
 * - Checks user authentication.
 * - If the user uses OAuth, certain fields are cleared.
 * - If a new email is provided and different from the current one, 
 *   it sends a verification email.
 * - If password change is requested, validates the current password and hashes the new one.
 * - Finally, updates the user's record in the database.
 *
 * @param values - The settings values validated against SettingsSchema.
 * @returns An object with either a success message or an error message.
 */
export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    // Retrieve the currently authenticated user.
    const user = await currentUser();

    // If no authenticated user or user id, return unauthorized error.
    if (!user || !user.id) {
        return { error: "Unauthorized!" };
    }

    // Retrieve the user record from the database.
    const dbUser = await getUserById(user.id);
    
    // If no corresponding user is found in the database, return an error.
    if (!dbUser) {
        return { error: "Unauthorized!" };
    }

    // If the user authenticated via OAuth, clear out fields not applicable for OAuth.
    if (user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.confirmNewPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    // Process email change: if a new email is provided and it differs from the current email.
    if (values.email && values.email !== user.email) {
        // Check if the new email is already in use by another user.
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in use!" };
        };

        // Generate a verification token for the new email.
        const verificationToken = await generateVerificationToken(values.email);
        // Send a verification email to the new email address.
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        // Inform the user that a verification email has been sent.
        return { success: "Verification email sent!" };
    }

    // Process password update:
    let passwordChanged = false;
    // check if both current and new passwords are provided.
    if (values.password && values.newPassword && dbUser.password) {
        // Compare the provided current password with the stored hashed password.
        const passwordMatch = await bcrypt.compare(values.password, dbUser.password);

        if (!passwordMatch) {
            return { error: "Invalid password!" };
        }

        // Check if the new password is the same as the current password.
        const isSamePassword = await bcrypt.compare(values.newPassword, dbUser.password);
        if (isSamePassword) {
            return { error: "You cannot use the same password. Please choose a new one." };
        }

        passwordChanged = true;

        // Hash the new password with a salt round of 10.
        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        // Replace the current password field with the hashed new password.
        values.password = hashedPassword;
        // Clear the newPassword and confirmNewPassword fields as they are no longer needed.
        values.newPassword = undefined;
        values.confirmNewPassword = undefined;
    }

    // Update the user's settings in the database using Prisma.
    await prisma.user.update({
        where: {
            id: dbUser.id,
        },
        data: {
            ...values, // Spread the processed values into the update data.
            ...(passwordChanged ? { passwordChangedAt: new Date() } : {}), // Update passwordChangedAt if password was changed
        },
    });

    // If a password change occurred, send a confirmation email.
    if (passwordChanged) {
        await sendPasswordChangeConfirmationEmail(dbUser.email);
        return { success: "Password changed. Please sign in again.", passwordChanged: true}
    }
    
    // Return a success message after updating the settings.
    return { success: "Settings Updated!", passwordChanged: false}
};

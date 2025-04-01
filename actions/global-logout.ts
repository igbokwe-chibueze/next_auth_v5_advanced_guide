// app/actions/global-logout.ts
"use server";

import { currentID } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Logs out all active sessions for the currently authenticated user by updating their passwordChangedAt timestamp.
 * This effectively invalidates all existing JWTs for the user.
 *
 * @returns An object with a success message or an error message.
 */
export const globalLogout = async () => {

    // Get the current session ID from the server
    const userID = await currentID();

    // If there is no user ID, return an error.
    if (!userID) {
        return { error: "Unauthorized: Not signed in" };
    }

    try {
        // Update the user's passwordChangedAt field to the current time.
        await prisma.user.update({
            where: { id: userID },
            data: { passwordChangedAt: new Date() },
        });

        // Return a success message.
        return { success: "All active sessions have been logged out." };
    } catch (error) {
        // Log the error for debugging purposes.
        console.error("Error during global sign out:", error);
        // Return a generic error message.
        return { error: "An error occurred while logging out all sessions." };
    }
};

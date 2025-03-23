"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT_URL } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }
    
    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Invalid credentials!" };
    }

    // Compare the provided password with the stored hash.
    const passwordMatches = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatches) {
        return { error: "Invalid credentials*wrong password!" };
    }

    // Only send verification email if the credentials are valid but email is unverified.
    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Verification email sent!" };
    }

    try {
        await signIn("credentials", { 
            email, 
            password, 
            redirectTo: DEFAULT_LOGIN_REDIRECT_URL 
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" };
                    
                default:
                    return { error: "Something went wrong!" };
            }
        }

        throw error; // if you dont throw this error, it wont redirect you.
    }
};

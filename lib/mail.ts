// lib/mail.ts

// Import the Resend library to send transactional emails.
import { Resend } from "resend";

// Create a new instance of Resend using the API key stored in environment variables.
// This key should be securely set (e.g., in .env.local) and prefixed with NEXT_PUBLIC_ if needed.
const resend = new Resend(process.env.RESEND_API_KEY);

// Retrieve the application domain from environment variables.
// This should be set to your production URL (or localhost during development).
const domain = process.env.NEXT_PUBLIC_APP_URL;


/**
 * Sends a verification email to a user.
 *
 * This function constructs a confirmation link including the provided token and
 * uses Resend to send an email with a clickable link for email confirmation.
 *
 * @param email - The recipient's email address.
 * @param token - The unique token used to verify the email address.
 */
export const sendVerificationEmail = async (email: string, token: string) => {
    // Construct the confirmation link using the domain and token.
    // Note: The URL will change based on your environment (production vs. development).
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    // Send the verification email using Resend's email sending service.
    await resend.emails.send({
        from: "onboarding@resend.dev", // The sender email address.
        to: email,                     // The recipient email.
        subject: "Confirm your email", // Email subject.
        // HTML body with a link that the user can click to verify their email.
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
};


/**
 * Sends a password reset email to a user.
 *
 * This function creates a reset link incorporating the token and sends an email
 * to the user with instructions to reset their password.
 *
 * @param email - The recipient's email address.
 * @param token - The unique token used for resetting the password.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
    // Construct the URL for password reset.
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    // Use Resend to dispatch the password reset email.
    await resend.emails.send({
        from: "onboarding@resend.dev", // Sender's email.
        to: email,                     // Recipient's email.
        subject: "Reset your password",// Email subject line.
        // HTML content with a clickable link for password reset.
        html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
};


/**
 * Sends a two-factor authentication token email.
 *
 * This function sends a simple email containing the two-factor authentication token,
 * which the user must enter to complete the authentication process.
 *
 * @param email - The recipient's email address.
 * @param token - The two-factor authentication token to be sent.
 */
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    // Send an email containing the two-factor authentication token.
    await resend.emails.send({
        from: "onboarding@resend.dev",          // Sender's email address.
        to: email,                              // Recipient's email address.
        subject: "Two Factor Authentication",   // Subject line of the email.
        // HTML body with the two-factor token.
        html: `<p>Your two factor token is: ${token}</p>`,
    });
};

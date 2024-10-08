import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { StringValidation } from "zod";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Secret Message Verification code',
            react:VerificationEmail({username, otp: verifyCode}),
          });
        return {success: true, message: "Verfication email send succesfully "};
    } catch (error) {
        console.error("Error sending verification email", error);
        return {success: false, message: "Failed to send verification email"};
    }
}
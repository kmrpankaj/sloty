"use server";
import * as z from "zod"
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { sendVerificationEmail } from "@/lib/mail";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/data/token";
import { getUserByEmail } from "@/data/user";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email doesn't exists." }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email)

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );
        return { success: "Confirmation email sent!" }
    }

    try {
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
            redirectedTo: DEFAULT_LOGIN_REDIRECT,

        })

        // if (result?.error) {
        //     return { error: result.error };
        // }

        // if (result?.ok) {
        //     return { success: "Logged in successfully!" };
        // }

        // Fallback in case result is undefined or unexpected
        return { error: "An unexpected error occurred." };

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" }
                default:
                    return { error: "Something went wrong" }
            }
        }
        throw error;
    }

};
"use server"

import * as z from "zod"

import { db } from "@/lib/db"
import {unstable_update} from "@/auth"
import { SettingsSchema } from "@/schemas"
import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { generateVerificationToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/mail"
import bcrypt from "bcryptjs"

export const settings = async (
    values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();

    if (!user || !user.id) {
        return { error: "Unauthorized" }
    }
    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: "Unauthorized" }
    }

    if (user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email)

        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in user!" }
        }

        const verificationToken = await generateVerificationToken(values.email);
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: "Verification email sent!" }
    }

    // Initialize an object to hold only the fields that should be updated
    const updateData: Partial<z.infer<typeof SettingsSchema>> = {};

    if (values.password && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(
            values.password,
            dbUser.password
        );

        if(!passwordsMatch) {
            return {error: "Incorrect password!"}
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        updateData.password = hashedPassword;
    }

        // Add other fields to updateData if they are provided
        if (values.name) {
            updateData.name = values.name;
        }
        if (values.email) {
            updateData.email = values.email;
        }
        if (values.isTwoFactorEnabled !== undefined) {
            updateData.isTwoFactorEnabled = values.isTwoFactorEnabled;
        }
        if (values.role) {
            updateData.role = values.role;
        }

// Update the user with only the fields in updateData
    const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: updateData,
        
    });

    unstable_update({
        user: {
            name: updatedUser.name,
            email: updatedUser.email,
            isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
            role: updatedUser.role,
        }
    })
    return { success: "Settings Updated" }
}
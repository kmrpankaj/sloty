"use server";

import * as z from "zod"
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { getTenantById } from "@/data/tenant";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already in use" }
    }

    const tenant = await db.tenant.create({
        data: {
            name,
        }
    })

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            tenantId: tenant.id,
        }
    });
    console.log("Hashed password:", hashedPassword);

    const verificationToken = await generateVerificationToken(email)

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    )

    return { success: "Confirmation email sent!" };
};
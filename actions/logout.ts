"use server"

import { signOut } from "@/auth"

export const logout = async (redirectTo = "/auth/login", callbackUrl?: string) => {
    const urlWithCallback = callbackUrl
        ? `${redirectTo}?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : redirectTo;
    // some server stuff
    await signOut({redirectTo: urlWithCallback})
}
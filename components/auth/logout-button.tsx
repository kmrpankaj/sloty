"use client";

import { logout } from "@/actions/logout";
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface LogoutButtonProps {
    children?: React.ReactNode;
}

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
    const searchParams = useSearchParams()
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    // Get the current URL to use as callbackUrl
    const callbackUrl = window.location.pathname;
    const onClick = () => {
        startTransition(async () => {
            await logout("/auth/login", callbackUrl); // Pass the callback URL to the logout function
            router.replace(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`); // Ensure redirection on the client side as well
        });
    }
    return (
        <span onClick={onClick} className="cursor-pointer">
            {children || "Logout"}
        </span>
    )
}
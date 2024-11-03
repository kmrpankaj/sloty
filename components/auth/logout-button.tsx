"use client";

import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface LogoutButtonProps {
    children?: React.ReactNode;
}

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
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
            {isPending ? (
                <span>Loading...</span> // or a spinner/loading indicator
            ) : (
                children || "Logout"
            )}
        </span>
    )
}
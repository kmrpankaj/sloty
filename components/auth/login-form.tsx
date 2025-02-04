"use client"

import * as z from "zod"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { LoginSchema } from "@/schemas"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { login } from "@/actions/login"
import Link from "next/link"
import { useRouter } from "next/navigation";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const { update } = useSession();
    const router = useRouter();
    const callbackUrl = searchParams.get("callbackUrl")
    const urlError = searchParams.get("error") === "OauthAccountNotLinked" ? "Email already in use with different provider!" : "";
    const [showTwoFactor, setShowTwoFactor] = useState(false)
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        // mode: "onChange"
    })
    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values, callbackUrl)
                .then(async (data) => {
                    if (data?.error) {
                        form.reset();
                        setError(data.error)
                    }
                    if (data?.success) {
                        form.reset();
                        setSuccess(data.success);
                    }
                    if (data?.twoFactor) {
                        setShowTwoFactor(true)
                    }
                    if (data?.redirectTo) {
                        router.push(data.redirectTo);
                        await update(); 
                        router.refresh(); // Refresh if necessary to update data
                    }
                })
                .catch(() => setError("Something went wrong"))
        })

    }
    return (
        <CardWrapper
            headerLabel="Welcome Back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Two Factor Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="123456"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                        )
                        }
                        {!showTwoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="John.doe@example.com"
                                                    type="email"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="******"
                                                    type="password"
                                                />
                                            </FormControl>
                                            <Button
                                                size="sm"
                                                variant="link"
                                                asChild
                                                className="px-0 font-normal"
                                            >
                                                <Link href="/auth/reset">Forgot Password?</Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                            )
                        }
                    </div>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                    >{showTwoFactor ? "Confirm": "Login"}</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
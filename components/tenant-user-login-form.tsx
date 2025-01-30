import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// For a more accurate type, you could import:
import type { UseFormRegister } from "react-hook-form";
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
// and then do register: ReturnType<typeof useForm>["register"];
interface LoginFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  register: UseFormRegister<{
    email: string;
    password: string;
    code?: string;
  }>;
  isPending: boolean;
  error?: string;
  success?: string;
  organizationName?: string;
  className?: string;
}

export function LoginForm({
  className,
  onSubmit,
  register,
  isPending,
  error,
  success,
  organizationName,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Your form, controlled by parent's onSubmit */}
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <div className="flex flex-col items-center text-center mb-4">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground">
                Login to your {organizationName} account
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
              </Button>
              <FormError message={error} />
              <FormSuccess message={success} />
              {/* Social Logins */}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="w-full">
                  Apple
                </Button>
                <Button variant="outline" className="w-full">
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  Meta
                </Button>
              </div>
              
              {/* Registration Link */}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>

          </form>

          {/* Right Side Image */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="/images/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

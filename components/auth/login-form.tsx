"use client"

import{ useForm } from "react-hook-form"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { CardWrapper } from "@/components/auth/card-wrapper"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { LoginSchema } from "@/schemas"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"

import { Eye, EyeOff } from "lucide-react"
import { login } from "@/actions/login"
import Link from "next/link"


export const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider"
        : ""
    
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values)
                .then((res) => {
                    setError(res?.error);
                    // TODO: ADD When we add 2FA
                    setSuccess(res?.success);
                })
                .catch((err) => {
                    setError(err.message);
                })
        });
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
                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Email */}
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="Enter your email"
                                            type="email"
                                            autoComplete="email"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder="******"
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="current-password"
                                                disabled={isPending}
                                            />
                                        </FormControl>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            className="absolute inset-y-0 right-0 flex items-center text-gray-400"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>

                                    <Button
                                        variant="link"
                                        size="sm"
                                        asChild
                                        className="px-0 flex justify-start font-normal"
                                    >
                                        <Link href="/auth/reset-password">
                                            Forgot Password?
                                        </Link>
                                    </Button>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full buttons"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <div className="flex items-center justify-center gap-2">
                                <span className="h-4 w-4 border-2 border-t-transparent border-solid rounded-full animate-spin" />
                                <span>Logging in</span>
                            </div>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </form>
            </Form>

        </CardWrapper>
    )
}
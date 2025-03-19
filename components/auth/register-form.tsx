"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { register } from "@/actions/register";

export const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            register(values)
                .then((res) => {
                    setError(res.error);
                    setSuccess(res.success);
                })
                .catch((err) => {
                    setError(err.message);
                });
        });
    };

    return (
        <CardWrapper
            headerLabel="Create Account"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your name"
                                            type="text"
                                            autoComplete="name"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                    <FormMessage />
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
                                                placeholder="Enter your password"
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute inset-y-0 right-0 flex items-center text-gray-400"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Confirm your password"
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute inset-y-0 right-0 flex items-center text-gray-400"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button type="submit" className="w-full buttons" disabled={isPending}>
                        {isPending ? (
                            <div className="flex items-center justify-center gap-2">
                                <span className="h-4 w-4 border-2 border-t-transparent border-solid rounded-full animate-spin" />
                                <span>Registering</span>
                            </div>
                        ) : (
                            "Register"
                        )}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};

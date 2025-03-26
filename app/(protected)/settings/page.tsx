"use client"

import * as z from "zod"
import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { settings } from "@/actions/settings"
import { SettingsSchema } from "@/schemas"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent }  from "@/components/ui/card"
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription }  from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }  from "@/components/ui/select"
import { Switch }  from "@/components/ui/switch"
import { Input }  from "@/components/ui/input"

import { useCurrentUser } from "@/hooks/use-current-user"
import { FormSuccess } from "@/components/form-success"
import { FormError } from "@/components/form-error"
import { Eye, EyeOff } from "lucide-react"
import { UserRole } from "@prisma/client"

const SettingsPage = () => {
    const user = useCurrentUser();

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const { update } = useSession();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            confirmNewPassword: undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
        },
    })
    
    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            settings(values)
                .then((res) => {
                    if (res.error) {
                        setError(res.error);
                    }

                    if (res.success) {
                        update();
                        setSuccess(res.success);
                    }
                })
                .catch(() => setError("Something Went Wrong !"));
        });
    }
    
    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">⚙️ Settings Page</p>
            </CardHeader>

            <CardContent>
                <Form { ...form}>
                    <form 
                        className="space-y-6" 
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
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
                                                    placeholder="Enter Your Name"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                    </FormItem>
                                )}
                            />
                            {user?.isOAuth === false && (
                                <>
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
        
                                    {/* Old Password */}
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
                                                            autoComplete="current-password"
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

                                    {/* New Password */}
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Enter new password"
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
                                        name="confirmNewPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Confirm your new password"
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
                                </>
                            )}

                            {/* Role Selector */}
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                                <SelectItem value={UserRole.USER}>User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            {/* Two Factor Authentication */}
                            {user?.isOAuth === false && (
                                <FormField
                                    control={form.control}
                                    name="isTwoFactorEnabled"
                                    render={({ field }) => (
                                        <FormItem 
                                            className="flex flex-row items-center justify-between rounded-lg 
                                            border p-3 shadow-sm"
                                        >
                                            <div className="space-y-0.5">
                                                <FormLabel>Two Factor Authentication</FormLabel>
                                                <FormDescription>Enable two factor authentication for your account.</FormDescription>
                                            </div>

                                            <FormControl>
                                                <Switch 
                                                    disabled={isPending}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <FormError message={error} />
                        <FormSuccess message={success} />

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="buttons"
                        >
                            {isPending ? (
                                <div className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 border-2 border-t-transparent border-solid rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default SettingsPage
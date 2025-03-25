import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
    user?: ExtendedUser;
    label: string;
}

export const UserInfo = ({
    user,
    label,
}: UserInfoProps) => {

    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">{label}</p>
            </CardHeader>

            <CardContent className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">User Information</h2>

                {user ? (
                    <>
                        {/* ID */}
                        <div className=" flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <p className="text-sm font-semibold">
                                ID
                            </p>
                            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                                {user?.id}
                            </p>
                        </div>

                        {/* Name */}
                        <div className=" flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <p className="text-sm font-semibold">
                                Name
                            </p>
                            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                                {user?.name}
                            </p>
                        </div>

                        {/* Email */}
                        <div className=" flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <p className="text-sm font-semibold">
                                Email
                            </p>
                            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                                {user?.email}
                            </p>
                        </div>

                        {/* Role */}
                        <div className=" flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <p className="text-sm font-semibold">
                                Role
                            </p>
                            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                                {user?.role}
                            </p>
                        </div>

                        {/* Two Factor Authentication */}
                        <div className=" flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <p className="text-sm font-semibold">
                                Two Factor Authentication
                            </p>
                            <Badge variant= {user?.isTwoFactorEnabled ? 'success' : 'destructive'}>
                                {user?.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                        </div>
                    </>

                ) : (
                        <p>No user information available.</p>
                    )}
            </CardContent>
            

        </Card>
    );
};

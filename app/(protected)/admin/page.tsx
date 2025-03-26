"use client"

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
    const onServerActionClick = () => {
        admin()
            .then((res) => {
                if (res.error) {
                    toast.error(res.error);
                }

                if (res.success) {
                    toast.success(res.success);
                }
            })
    }
    const onApiRouteClick = () => {
        fetch("/api/admin")
            .then((res) => {
                if (res.ok) {
                    toast.success("Allowed API Route")
                } else {
                    toast.error("FORBIDDEN API Route")
                    
                }
            })
    }

    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">👨‍💼 Admin</p>
            </CardHeader>

            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message="Welcome to Admin Page, You Can View"/>
                </RoleGate>

                <div className="flex flex-row justify-between items-center rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-semibold">
                        Admin-only API Route
                    </p>
                    <Button onClick={onApiRouteClick} className="buttons">
                        Click to test
                    </Button>
                </div>

                <div className="flex flex-row justify-between items-center rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-semibold">
                        Admin-only Server Action
                    </p>
                    <Button onClick={onServerActionClick} className="buttons">
                        Click to test
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminPage;

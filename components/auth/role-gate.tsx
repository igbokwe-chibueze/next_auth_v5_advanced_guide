"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
//import { usePathname, useRouter } from "next/navigation";
//import { useEffect } from "react";
import { FormError } from "../form-error";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole;
};

export const RoleGate = ({
    children,
    allowedRole,
}: RoleGateProps) => {
    const role = useCurrentRole();
    // const pathname = usePathname();
    // const router = useRouter();

    // useEffect(() => {
    //     if (role !== allowedRole) {
    //         router.push("/auth/error");
    //     }
    // }, [role, router, allowedRole, pathname]);

    if (role !== allowedRole) {
        return (
            <FormError message="You are not allowed to access this page."/>
        );
    }

    return (
        <>
            {children}
        </>
    );
};

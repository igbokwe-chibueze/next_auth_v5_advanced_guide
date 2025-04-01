"use client";

import { logout } from "@/actions/logout";
import { globalLogout } from "@/actions/global-logout";

interface GlobalLogoutButtonProps {
    children: React.ReactNode;
}

export const GlobalLogoutButton = ({ children }: GlobalLogoutButtonProps) => {

    const onClick = async () => {
        try {
            const res = await globalLogout();
            if (res.success) {
                // After the server action updates passwordChangedAt, sign out the current device.
                logout();
            }
        } catch (error) {
            console.error("Global sign out error:", error);
        }
    };
      

    return (
        <span
            onClick={onClick}
            className="cursor-pointer"
        >
            {children}
        </span>
    );
};

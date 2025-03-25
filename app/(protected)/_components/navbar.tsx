"use client";

import { UserButton } from "@/components/auth/user-button";
//import { useCurrentUser } from "@/hooks/use-current-user";
//import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
//import { logout } from "@/actions/logout";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {

    const pathname = usePathname();

    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
            <div className="flex gap-x-2">
                {/* Server */}
                <Button
                    asChild
                    variant={pathname === "/server" ? "default" : "outline"}
                >
                    <Link href={"/server"}>
                        Server
                    </Link>
                </Button>

                {/* Client */}
                <Button
                    asChild
                    variant={pathname === "/client" ? "default" : "outline"}
                >
                    <Link href={"/client"}>
                        Client
                    </Link>
                </Button>

                {/* Admin */}
                <Button
                    asChild
                    variant={pathname === "/admin" ? "default" : "outline"}
                >
                    <Link href={"/admin"}>
                        Admin
                    </Link>
                </Button>

                {/* Settings */}
                <Button
                    asChild
                    variant={pathname === "/settings" ? "default" : "outline"}
                >
                    <Link href={"/settings"}>
                        Settings
                    </Link>
                </Button>
            </div>
            
            {/* User */}
            <UserButton/>
        </nav>
    );
};

//app/(protected)/_components/navbar.tsx
"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
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
                    className="buttons"
                >
                    <Link href={"/server"}>
                        Server
                    </Link>
                </Button>

                {/* Client */}
                <Button
                    asChild
                    variant={pathname === "/client" ? "default" : "outline"}
                    className="buttons"
                >
                    <Link href={"/client"}>
                        Client
                    </Link>
                </Button>

                {/* Admin */}
                <Button
                    asChild
                    variant={pathname === "/admin" ? "default" : "outline"}
                    className="buttons"
                >
                    <Link href={"/admin"}>
                        Admin
                    </Link>
                </Button>

                {/* Settings */}
                <Button
                    asChild
                    variant={pathname === "/settings" ? "default" : "outline"}
                    className="buttons"
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

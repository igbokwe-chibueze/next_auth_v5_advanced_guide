"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogoutButton } from "./logout-button";
import { FaUser } from "react-icons/fa";
import { SidebarCloseIcon } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

export const UserButton = () => {
    const user = useCurrentUser();    

    return (
        <div className="flex items-center gap-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-x-2">
                    <Avatar className="buttons">
                        <AvatarImage src={user?.image || ""}/>
                        <AvatarFallback className="bg-sky-500 text-white">
                            <FaUser/>
                        </AvatarFallback>
                    </Avatar>

                    <div className=" text-sm font-medium text-gray-800 ">
                        {user?.name || "Guest"}
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40" align="end">
                    <LogoutButton>
                        <DropdownMenuItem>
                            <SidebarCloseIcon className=" h-4 w-4 mr-2 text-gray-800"/>
                            Logout
                        </DropdownMenuItem>
                    </LogoutButton>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

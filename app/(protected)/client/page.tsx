"use client";

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage = () => {
    const user = useCurrentUser();

    return (
        <div>
            <UserInfo user={user} label="📱 Client Side Component" />
        </div>
    );
};

export default ClientPage;

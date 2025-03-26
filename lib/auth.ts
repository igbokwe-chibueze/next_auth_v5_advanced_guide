//Useful for getting user data server side, unlike use-current-user and use-current-roles hooks that get it client side.

import { auth } from "@/auth";

export const currentUser = async () => {
    const session = await auth();

    return session?.user;
};

export const currentRole = async () => {
    const session = await auth();

    return session?.user?.role;
};

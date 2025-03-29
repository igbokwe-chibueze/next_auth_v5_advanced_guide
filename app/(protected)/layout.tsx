//app/(protected)/layout.tsx

import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

import { Navbar } from "./_components/navbar";

export default async function ProtectedLayout({children,}: {children: React.ReactNode;}) {

    const session = await auth();

    return (
        <SessionProvider session={session}>
            <div className=" flex min-h-screen flex-col items-center justify-center gap-y-10
                bg-radial-[at_50%_10%] from-sky-200 via-blue-400 to-indigo-900 to-90%"
            >
                <Navbar/>
                {children}
            </div>
        </SessionProvider>
    )
}

//components/auth/GlobalSessionChecker.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/logout";

// GlobalSessionChecker component monitors the current session globally.
// If the session indicates that the password has been changed, it triggers a logout.
const GlobalSessionChecker: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the session object exists and indicates that the password has changed...
    if (session?.hasPasswordChanged) {
      // Call the logout function to end the session.
      logout();
    }
    // The effect depends on both session and router, ensuring it runs when either changes.
  }, [session, router]);

  // This component doesn't render any visible UI; it only performs session checks.
  return null;
};

export default GlobalSessionChecker;

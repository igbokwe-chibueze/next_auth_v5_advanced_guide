"use client"
import { useRouter } from "next/navigation";

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "modal" | "redirect",
    asChild?: boolean;
};

const LoginButton = ({ children, mode = "redirect" }: LoginButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push("/auth/login");
    }

    if (mode === "modal") {
        return (
            <span>
                TODO: Implement Modal Login
            </span>
        )
    }
  return (
    <span onClick={onClick}>
        {children}
    </span>
  )
}

export default LoginButton
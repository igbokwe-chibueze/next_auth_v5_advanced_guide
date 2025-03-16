import LoginButton from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins ({
  subsets: ["latin"],
  weight: ["600"],

})

export default function Home() {
  return (
    <main className=" flex min-h-screen flex-col items-center justify-center 
      bg-radial-[at_50%_10%] from-sky-200 via-blue-400 to-indigo-900 to-90%"
    >
      <div className="space-y-6 text-center">
        <h1 className={cn(
          font.className,
          "text-6xl font-semibold text-white drop-shadow-md"
        )}>
          🔒 Auth
        </h1>
        <p className="text-white">
          A simple authentication service.
        </p>
        <div>
          <LoginButton>
            <Button variant={"secondary"} size={"lg"} className="buttons">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}

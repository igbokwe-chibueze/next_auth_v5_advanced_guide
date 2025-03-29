import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {signIn} from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT_URL } from "@/routes";
import { useSearchParams } from "next/navigation";


const Socials = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    
    const onClick = (provider: "google" | "github") => {
        signIn(provider, {
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT_URL
        });
    }
    
    return (
        <div className="flex items-center w-full gap-x-2">
            <Button size={"lg"} variant={"outline"} 
                className="flex-1 buttons"
                onClick={() => onClick("google")}
            >
                <FcGoogle className="h-5 w-5" />
            </Button>

            <Button size={"lg"} variant={"outline"} 
                className="flex-1 buttons"
                onClick={() => onClick("github")}
            >
                <FaGithub className="h-5 w-5" />
            </Button>
        </div>
    )
}

export default Socials;

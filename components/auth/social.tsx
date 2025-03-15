import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

const Socials = () => {
    return (
        <div className="flex items-center w-full gap-x-2">
            <Button size={"lg"} variant={"outline"} 
                className="flex-1"
                onClick={() => {}}
            >
                <FcGoogle className="h-5 w-5" />
            </Button>

            <Button size={"lg"} variant={"outline"} 
                className="flex-1"
                onClick={() => {}}
            >
                <FaGithub className="h-5 w-5" />
            </Button>
        </div>
    )
}

export default Socials;

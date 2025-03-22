import { CardWrapper } from "./card-wrapper";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorCard = () => {
    return (
        <CardWrapper 
            headerLabel="Something went wrong!"
            backButtonLabel="Back to Login"
            backButtonHref="/auth/login"
        >
            <div className="w-full flex justify-center items-center">
                <FaExclamationTriangle className="text-destructive"/>
            </div>
        </CardWrapper>
    )
}

export default ErrorCard;

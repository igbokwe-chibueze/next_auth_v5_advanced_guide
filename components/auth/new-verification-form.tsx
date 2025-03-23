"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners"
import { newVerification } from "@/actions/new-verification";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;       

        if (!token) {
            setError("Invalid credentials*4of5!");
            return;
        }
        
        newVerification(token)
            .then((res) => {
                setSuccess(res.success);
                setError(res.error);
            })
            .catch((err) => {
                setError(err.message);
            });

    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    if (!token) {
        return null;
    }

    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <div className="w-full flex flex-col items-center justify-center">
                { !success && !error && (
                    <BeatLoader/>
                )}

                <FormSuccess message={success}/>
                {!success && (
                    <FormError message={error}/>
                )}
            </div>
        </CardWrapper>
    );
};

"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
//import { useRouter } from "next/navigation";

interface BackButtonProps {
    label: string;
    href: string;
};

export const BackButton = ({ label, href }: BackButtonProps) => {

    return (
        <Button
            variant={"link"}
            className="font-normal buttons"
            size={"sm"}
            asChild
        >
            <Link
                href={href}
            >
                {label}
            </Link>
        </Button>
    )
}

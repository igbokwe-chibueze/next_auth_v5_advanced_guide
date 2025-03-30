// components/client-toast.jsx (client component)
"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface ClientToastProps {
    message: string | string[];
}

const ClientToast = ({ message }: ClientToastProps) => {
  useEffect(() => {
    toast.success(message);
  }, [message]);

  return null; // No visual output; toast displays globally.
};

export default ClientToast;

// components/auth/DeleteUserButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { deleteUser } from "@/actions/delete-user";

type DeleteUserButtonProps = {
  userId: string;
};

export default function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  const router = useRouter();

  return (
    <form
      action={async () => {
        await deleteUser(userId);
        // Refresh the current route to update the UI
        router.refresh();
      }}
    >
      <button
        type="submit"
        className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        Delete
      </button>
    </form>
  );
}

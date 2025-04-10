//Useful for getting user data client side, unlike auth.ts that get it sever side.

import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user;
};

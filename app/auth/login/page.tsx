// app/auth/login/page.tsx

import { LoginForm } from "@/components/auth/login-form";
import ClientToast from "@/components/client-toast";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string | string[];
  }>;
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const resolvedSearchParams = await searchParams;
  const message = resolvedSearchParams.message;
  return (
    <div>
      {message && <ClientToast message={message} />}
      <LoginForm />
    </div>
  );
};

export default LoginPage;

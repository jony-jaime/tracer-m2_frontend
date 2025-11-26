import AuthGuard from "@/components/shared/auth-guard";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
      <Toaster position="top-center" />
      {process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT && <Script async src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT}`} />}
    </AuthGuard>
  );
}

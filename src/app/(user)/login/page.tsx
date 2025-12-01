import { LoginForm } from "@/components/login-form";
import Logo from "@/components/shared/logo";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 w-full">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="w-32">
            <Logo />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block pointer-events-none">
        <img
          src="/login-bg.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

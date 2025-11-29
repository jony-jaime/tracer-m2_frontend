"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User } from "@/interfaces/user";
import { ClipLoader } from "react-spinners";
import SubmitError from "./form/erros";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const { login, loading, errorMessage } = useAuth();
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Ingrese un email válido").required("Este campo es requerido"),
      password: Yup.string().required("Este campo es requerido"),
    }),
    onSubmit: async (values) => {
      await login(values.email, values.password)
        .then((response) => {
          const data = response?.data;

          if (data?.token) {
            setToken(data.token);
            setUser(data.user as User);
            router.push("/dashboard");
          }
        })
        .catch((err) => {
          console.error("An error occurred", err?.error);
        });
    },
  });

  return (
    <form className={cn("flex flex-col", className)} onSubmit={formik.handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">Enter your email below to login to your account</p>
      </div>
      <div className="grid gap-3">
        {errorMessage && <SubmitError errorMessage={errorMessage} />}
        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...formik.getFieldProps("email")}
            className={cn(formik.touched.email && formik.errors.email && "border-red-500 focus-visible:ring-red-500")}
          />
          {formik.touched.email && formik.errors.email && <span className="text-red-500 text-xs block mb-2">{formik.errors.email}</span>}
        </div>
        <div className="grid gap-1">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a> */}
          </div>
          <Input
            id="password"
            type="password"
            {...formik.getFieldProps("password")}
            className={cn(formik.touched.password && formik.errors.password && "border-red-500 focus-visible:ring-red-500")}
          />
          {formik.touched.password && formik.errors.password && <span className="text-red-500 text-xs block mb-2">{formik.errors.password}</span>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <ClipLoader size={16} className="mr-2" />}
          Login
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
        <Button variant="outline" className="w-full" type="button">
          <svg width="753" height="768" viewBox="0 0 753 768" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M752.64 392.727C752.64 365.498 750.196 339.316 745.658 314.182H384V462.895H590.662C581.585 510.72 554.356 551.215 513.513 578.444V675.142H638.138C710.749 608.116 752.64 509.673 752.64 392.727Z" fill="#4285F4" />
            <path d="M384 768C487.68 768 574.604 733.789 638.138 675.142L513.513 578.444C479.302 601.484 435.665 615.447 384 615.447C284.16 615.447 199.331 548.073 168.96 457.309H41.1927V556.451C104.378 681.775 233.891 768 384 768Z" fill="#34A853" />
            <path d="M168.96 456.96C161.28 433.92 156.742 409.484 156.742 384C156.742 358.516 161.28 334.08 168.96 311.04V211.898H41.1927C15.0109 263.564 0 321.862 0 384C0 446.138 15.0109 504.436 41.1927 556.102L140.684 478.604L168.96 456.96Z" fill="#FBBC05" />
            <path d="M384 152.902C440.553 152.902 490.822 172.451 530.967 210.153L640.931 100.189C574.255 38.0509 487.68 0 384 0C233.891 0 104.378 86.2255 41.1927 211.898L168.96 311.04C199.331 220.276 284.16 152.902 384 152.902Z" fill="#EA4335" />
          </svg>

          Login with Google
        </Button>
      </div>
      {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div> */}
    </form>
  );
}

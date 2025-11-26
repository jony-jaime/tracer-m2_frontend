"use client";

import SubmitError from "@/components/form/erros";
import { Input } from "@/components/form/input";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/interfaces/user";
import useAuthStore from "@/store/useAuthStore";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import * as Yup from "yup";

export default function Login() {
  const { login, loading, errorMessage } = useAuth();
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();

  return (
    <section className="w-full">
      <div className="w-full flex justify-center items-center flex-col p-4">
        <h1 className="text-2xl lg:text-4xl font-bold text-center animate-fade-down">Login</h1>
        <div className="animate-fade-up animate-delay-150 w-full max-w-[600px]">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object({
              email: Yup.string().email("Ingrese un email válido").required("Este campo es requerido"),
              password: Yup.string().required("Este campo es requerido"),
            })}
            onSubmit={async (values) => {
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
            }}
          >
            {() => (
              <Form className="relative -mt-6 flex min-w-full flex-col gap-3 overflow-hidden rounded-xl px-0 py-6" autoComplete="off">
                <SubmitError errorMessage={errorMessage} />
                <Input label="Email" name="email" placeholder="Email" />
                <Input label="Password" name="password" placeholder="Password" type="password" />

                <div className="flex justify-center flex-col-reverse lg:flex-row items-center">
                  <button type="submit" disabled={loading} className="btn btn-gradient relative w-full justify-center disabled:pointer-events-none disabled:opacity-50">
                    {loading && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <ClipLoader color="white" size={16} />
                      </div>
                    )}

                    <span className={`${loading ? "opacity-0" : "opacity-100"} transition-all`}>Login</span>
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
}

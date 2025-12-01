"use client";
import { User } from "@/interfaces/user";
import api from "@/lib/api";
import endPoints from "@/services/endpoints";
import useAuthStore from "@/store/useAuthStore";
import { AxiosError } from "axios";
import { useState } from "react";

type HandleSubmitResponse = {
  token?: string;
  user?: User;
  [key: string]: unknown;
};

type ResetFormFunction = () => void;

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

type SubmitMethod = "create" | "update";

const useForm = (urlEndpoint: string, methodType: SubmitMethod = "create") => {
  const [sending, setSending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string[] | Record<string, string[]>>([]);

  const { token: user_token } = useAuthStore();

  const handleSubmit = async (formData: FormData, resetForm?: ResetFormFunction) => {
    return new Promise<HandleSubmitResponse>((resolve, reject) => {
      if (!window.grecaptcha) {
        console.error("grecaptcha not loaded");
        reject();
        return;
      }

      window.grecaptcha.ready(() => {
        setSending(true);

        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT as string, { action: "submit" })
          .then(async (token: string) => {
            try {
              formData.append("gRecaptchaResponse", token);
              if (methodType === "update") {
                formData.append("_method", "PUT");
              }
              await api.get(endPoints.sanctum);

              const response = await api({
                method: "post",
                url: urlEndpoint,
                data: formData,
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${user_token}`,
                },
              });

              setSending(false);
              setSuccess(true);
              setTimeout(() => setSuccess(false), 5000);
              resetForm?.();

              resolve(response.data);
            } catch (err) {
              const error = err as AxiosError<{
                message?: string | Record<string, string[]>;
                errors?: Record<string, string[]>;
              }>;

              const messages = error.response?.data?.errors
                ? error.response.data.errors
                : typeof error.response?.data?.message === "object"
                  ? Object.values(error.response.data.message).flat()
                  : typeof error.response?.data?.message === "string"
                    ? [error.response.data.message]
                    : ["Ocurrió un error inesperado."];

              setErrorMessage(messages);
              setSending(false);
              setError(true);
              setTimeout(() => setError(false), 5000);

              reject();
            }
          });
      });
    });
  };

  return {
    sending,
    success,
    error,
    errorMessage,
    handleSubmit,
  };
};

export default useForm;

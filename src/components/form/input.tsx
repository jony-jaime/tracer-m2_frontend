"use client";

import { ErrorMessage, useField } from "formik";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  name: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  name,
  containerClassName,
  ...rest
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  const inputId = id || name;

  return (
    <div className={`w-full space-y-1 ${containerClassName || ""}`}>
      {label && (
        <Label htmlFor={inputId} className={hasError ? "text-red-500" : ""}>
          {label}
        </Label>
      )}

      <ShadcnInput
        id={inputId}
        {...field}
        {...rest}
        className={`
          ${rest.className || ""}
          ${hasError ? "border-red-500 focus-visible:ring-red-500" : ""}
        `}
      />

      <ErrorMessage
        name={name}
        component="span"
        className="text-xs text-red-500"
      />
    </div>
  );
};

"use client";

import { ErrorMessage, useField } from "formik";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface InputProps {
  id?: string;
  label: string;
  name: string;
  customclass?: string;
  placeholder?: string;
}

export const TextArea: React.FC<InputProps> = ({
  id,
  label,
  name,
  customclass,
  placeholder,
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className={cn("w-full flex flex-col gap-1", customclass)}>
      <label
        htmlFor={id || name}
        className={cn(
          "text-sm font-medium",
          hasError && "text-red-500"
        )}
      >
        {label}
      </label>

      <Textarea
        id={id || name}
        {...field}
        placeholder={placeholder || ""}
        className={cn(
          hasError &&
          "border-red-500 focus-visible:ring-red-500 focus-visible:ring-1"
        )}
      />

      <ErrorMessage
        name={name}
        component="span"
        className="text-red-500 text-xs"
      />
    </div>
  );
};

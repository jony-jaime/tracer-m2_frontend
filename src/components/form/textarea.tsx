"use client";
import { ErrorMessage, useField } from "formik";

interface InputProps {
  id?: string;
  label: string;
  name: string;
  customclass?: string;
  type?: string;
  placeholder?: string;
}

export const TextArea: React.FC<InputProps> = (props) => {
  const [field, meta] = useField(props.name);
  const hasError = meta.touched && meta.error;

  return (
    <div className={`relative w-full ${props.customclass || ""}`}>
      <textarea
        id={props.id || props.name}
        {...field}
        {...props}
        placeholder=" "
        className={`peer w-full border rounded-md px-4 pt-6 pb-2 
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none
          ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"}
        `}
      />
      <label
        htmlFor={props.id || props.name}
        className={`absolute left-4 top-2 text-xs text-gray-500 transition-all 
          peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
          peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500 
          ${hasError ? "text-red-500 peer-focus:text-red-500" : ""}
        `}
      >
        {props.label}
      </label>
      <ErrorMessage name={props.name} component="span" className="text-red-500 text-xs mt-1 block" />
    </div>
  );
};

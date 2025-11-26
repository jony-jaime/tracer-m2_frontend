"use client";
import { ErrorMessage, useField, useFormikContext } from "formik";
import React from "react";

interface CheckboxProps {
  id?: string;
  label?: React.ReactNode;
  name: string;
  value?: string;
  customclass?: string;
  dangerouslySetInnerHTMLLabel?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, name, value, customclass, dangerouslySetInnerHTMLLabel, disabled }) => {
  const [field, meta, helpers] = useField(name);
  const { setTouched } = useFormikContext();

  const isArray = Array.isArray(field.value);
  const checkboxId = id || (isArray && value ? `${name}-${value}` : name);

  // Estado "checked" según si es boolean o array
  const checked = isArray ? (field.value as string[]).includes(String(value ?? "")) : Boolean(field.value);

  const hasError = meta.touched && Boolean(meta.error);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (isArray) {
      const current: string[] = field.value || [];
      const item = String(value ?? "");
      if (isChecked) {
        if (!current.includes(item)) helpers.setValue([...current, item]);
      } else {
        helpers.setValue(current.filter((v) => v !== item));
      }
    } else {
      helpers.setValue(isChecked);
    }
  };

  const handleBlur = () => {
    setTouched({ [name]: true }, true);
  };

  return (
    <div className={`relative my-2 ${customclass || ""}`}>
      <label htmlFor={checkboxId} className={`flex gap-2 leading-snug items-start select-none ${hasError ? "text-red-500 peer-focus:text-red-500" : ""}`}>
        <input
          id={checkboxId}
          name={name}
          type="checkbox"
          disabled={disabled}
          // En arrays conviene enviar el value explícito, en boolean no es necesario
          {...(isArray && value ? { value: String(value) } : {})}
          checked={checked}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-4 h-4 mt-0.5 cursor-pointer ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"}`}
        />

        {/* Label */}
        {dangerouslySetInnerHTMLLabel ? <span dangerouslySetInnerHTML={{ __html: dangerouslySetInnerHTMLLabel }} /> : <span>{label}</span>}
      </label>

      {/* Para arrays, el error puede venir como string o array; ErrorMessage maneja string */}
      <ErrorMessage name={name} component="span" className="text-red-500 text-xs mt-1 block" />
    </div>
  );
};

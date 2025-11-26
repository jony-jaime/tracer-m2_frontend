"use client";
import React from "react";
import { ErrorMessage, useField, useFormikContext } from "formik";

interface RadioProps {
  id?: string;
  label?: React.ReactNode;
  name: string;
  value: string;
  customclass?: string;
  dangerouslySetInnerHTMLLabel?: string;
  disabled?: boolean;
}

export const Radio: React.FC<RadioProps> = ({ id, label, name, value, customclass, dangerouslySetInnerHTMLLabel, disabled }) => {
  const [field] = useField({ name, type: "radio", value });
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const radioId = id || `${name}-${value}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFieldValue(name, value, true);
      setFieldTouched(name, true, false);
    }
  };

  return (
    <div className={`relative my-2 ${customclass || ""}`}>
      <label htmlFor={radioId} className="flex gap-2 leading-snug items-start select-none">
        <input id={radioId} type="radio" {...field} checked={field.checked} disabled={disabled} onChange={handleChange} className="w-4 h-4 mt-0.5 cursor-pointer border-gray-300" />
        {dangerouslySetInnerHTMLLabel ? <span dangerouslySetInnerHTML={{ __html: dangerouslySetInnerHTMLLabel }} /> : <span>{label}</span>}
      </label>
    </div>
  );
};

interface RadioOption {
  value: string;
  label?: React.ReactNode;
  htmlLabel?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  groupLabel?: React.ReactNode;
  className?: string;
  optionsClassName?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, groupLabel, className, optionsClassName }) => {
  const [, meta] = useField(name);
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <div className={className}>
      {groupLabel && <div className={`mb-2 ${hasError ? "text-red-500" : ""}`}>{groupLabel}</div>}

      <div className={optionsClassName}>
        {options.map((opt) => (
          <Radio
            id={`${name}-${opt.value}`}
            key={`${name}-${opt.value}`}
            name={name}
            value={opt.value}
            label={opt.label}
            dangerouslySetInnerHTMLLabel={opt.htmlLabel}
            disabled={opt.disabled}
            customclass="mr-4 inline-flex"
          />
        ))}
      </div>

      <ErrorMessage name={name} component="span" className="text-red-500 text-xs mt-1 block" />
    </div>
  );
};

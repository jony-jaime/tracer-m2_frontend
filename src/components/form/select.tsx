// Select.tsx
"use client";

import { ErrorMessage, useField } from "formik";
import React from "react";
import ReactSelect, { components, MultiValue, SingleValue } from "react-select";
import { ChevronDown } from "react-feather";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  label: string;
  name: string;
  customclass?: string;
  options: Option[];
  isMulti?: boolean;
  placeholder?: string;

  value?: Option | Option[] | null;
  onChange?: (selected: MultiValue<Option> | SingleValue<Option>) => void;
}

export const Select: React.FC<SelectProps> = (props) => {
  const [field, meta, helpers] = useField(props.name);
  const hasError = meta.touched && meta.error;

  // Si pasan value/onChange → lo usamos como controlled
  const isControlled = props.value !== undefined && props.onChange;

  // Adaptar value de Formik a react-select (cuando no es controlled)
  const currentValue = props.isMulti
    ? props.options?.filter((opt) => (Array.isArray(field.value) ? field.value.includes(opt.value) : []))
    : props.options?.find((opt) => opt.value === field.value) || null;

  const handleChange = (selected: MultiValue<Option> | SingleValue<Option>) => {
    if (isControlled) {
      props.onChange?.(selected);
    } else {
      if (props.isMulti) {
        const selectedArray = (selected as MultiValue<Option>) || [];
        helpers.setValue(selectedArray.map((s) => s.value));
      } else {
        const selectedOption = selected as SingleValue<Option>;
        helpers.setValue(selectedOption ? selectedOption.value : "");
      }
    }
  };

  return (
    <div className={`relative w-full ${props.customclass || ""}`}>
      <ReactSelect
        inputId={props.id || props.name}
        options={props.options}
        value={isControlled ? props.value : currentValue}
        isMulti={props.isMulti}
        placeholder={props.placeholder || "Seleccionar..."}
        classNamePrefix="react-select"
        onChange={handleChange}
        onBlur={() => helpers.setTouched(true)}
        components={{
          DropdownIndicator: (p) => (
            <components.DropdownIndicator {...p}>
              <ChevronDown className="text-gray-400" size={18} />
            </components.DropdownIndicator>
          ),
        }}
      />

      <label
        htmlFor={props.id || props.name}
        className={`absolute left-2 -top-2.5 bg-white px-1 text-xs text-gray-500 transition-all 
          ${hasError ? "text-red-500" : ""}`}
      >
        {props.label}
      </label>

      <ErrorMessage name={props.name} component="span" className="text-red-500 text-xs mt-1 block" />
    </div>
  );
};

export default Select;

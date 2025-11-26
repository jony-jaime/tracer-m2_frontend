"use client";
import React from "react";
import ReactSelect from "react-select";

interface Option {
  value: string;
  label: string;
}

interface EmployeeSelectProps {
  label: string;
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
}

export const EmployeeSelect: React.FC<EmployeeSelectProps> = ({ label, options, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <ReactSelect
        isMulti
        options={options}
        value={value}
        onChange={(selected) => onChange(selected as Option[])}
        placeholder="Buscar empleados..."
        classNamePrefix="react-select"
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
      />
    </div>
  );
};

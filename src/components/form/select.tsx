"use client";

import { useField, useFormikContext } from "formik";
import { useState, useEffect } from "react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty,
} from "@/components/ui/command";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";

import clsx from "clsx";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  isMulti?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  id,
  name,
  label,
  options,
  placeholder = "Seleccionar...",
  isMulti = false,
  className,
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const hasError = meta.touched && meta.error;
  const inputId = id || name;

  const [open, setOpen] = useState(false);

  // Convert formik value → array or string depending on mode
  const selectedValues: string[] = isMulti
    ? Array.isArray(field.value)
      ? field.value
      : []
    : field.value
      ? [field.value]
      : [];

  const toggleValue = (value: string) => {
    if (isMulti) {
      if (selectedValues.includes(value)) {
        setFieldValue(
          name,
          selectedValues.filter((v) => v !== value)
        );
      } else {
        setFieldValue(name, [...selectedValues, value]);
      }
    } else {
      setFieldValue(name, value);
      setOpen(false);
    }
  };

  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div className={`flex flex-col gap-1 w-full ${className || ""}`}>
      {label && (
        <Label htmlFor={inputId} className={hasError ? "text-red-500" : ""}>
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={inputId}
          className={clsx(
            "w-full border rounded-md px-3 py-2 flex justify-between items-center cursor-pointer",
            "bg-background",
            hasError ? "border-red-500" : "border-input"
          )}
        >
          <div className="flex flex-wrap gap-1 text-sm">
            {selectedLabels.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}

            {isMulti
              ? selectedLabels.map((label) => (
                <Badge
                  key={label}
                  variant="secondary"
                  className="mr-1"
                >
                  {label}
                </Badge>
              ))
              : selectedLabels[0]}
          </div>

          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar..." />
            <CommandEmpty>No encontrado</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {options.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);

                return (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => toggleValue(opt.value)}
                  >
                    <Check
                      className={clsx(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {hasError && (
        <span className="text-xs text-red-500">{meta.error}</span>
      )}
    </div>
  );
};

export default Select;

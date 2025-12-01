"use client";

import { useState } from "react";
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
import { Check, X } from "lucide-react";

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

export const EmployeeSelect: React.FC<EmployeeSelectProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const toggleSelect = (opt: Option) => {
    const exists = value.some((v) => v.value === opt.value);
    if (exists) {
      onChange(value.filter((v) => v.value !== opt.value));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <div className="relative w-full">
      {/* INPUT-LIKE BUTTON */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`
              peer w-full rounded-md border border-input
              bg-background text-foreground
              px-4 pt-6 pb-2 text-left 
              focus:outline-none focus:ring-2 focus:ring-ring
            `}
          >
            <span className="text-sm">
              {value.length > 0 ? `${value.length} seleccionados` : ""}
            </span>
          </button>
        </PopoverTrigger>

        {/* FLOATING LABEL */}
        <label
          className={`
            absolute left-4 top-2 text-xs text-muted-foreground transition-all
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
            peer-placeholder-shown:text-muted-foreground
            peer-focus:top-2 peer-focus:text-xs peer-focus:text-ring
            ${value.length > 0 ? "top-2 text-xs" : ""}
          `}
        >
          {label}
        </label>

        {/* DROPDOWN */}
        <PopoverContent className="w-[300px] p-0 bg-popover" align="start">
          <Command className="bg-popover">
            <CommandInput placeholder="Buscar..." className="text-foreground" />
            <CommandEmpty>No hay resultados.</CommandEmpty>

            <CommandGroup>
              {options.map((opt) => {
                const isSelected = value.some((v) => v.value === opt.value);
                return (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => toggleSelect(opt)}
                    className="cursor-pointer text-foreground"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"
                        }`}
                    />
                    {opt.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* BADGES */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((opt) => (
            <Badge
              key={opt.value}
              variant="secondary"
              className="px-2 py-1 flex items-center gap-1"
            >
              {opt.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onChange(value.filter((v) => v.value !== opt.value))
                }
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

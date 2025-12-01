"use client";
import { useField, useFormikContext, ErrorMessage } from "formik";
import { useCallback, useEffect } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { Trash2 } from "react-feather";

interface DropzoneInputProps {
  name: string;
  label?: string;
  multiple?: boolean;
  acceptedFormats?: Accept;
  customclass?: string;
}

type FileOrUrl = File | string;

export const DropzoneInput: React.FC<DropzoneInputProps> = ({
  name,
  label,
  multiple = true,
  acceptedFormats,
  customclass,
}) => {
  const [, meta] = useField<FileOrUrl[] | FileOrUrl | null>(name);
  const { setFieldValue } = useFormikContext();
  const hasError = meta.touched && meta.error;

  const value = (meta.value as FileOrUrl[]) || [];

  // --- DROP HANDLER ---
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        const current = value || [];
        setFieldValue(name, [...current, ...acceptedFiles]);
      } else {
        setFieldValue(name, acceptedFiles[0]);
      }
    },
    [setFieldValue, name, multiple, value]
  );

  // --- REMOVE ---
  const removeFile = (index: number) => {
    if (!Array.isArray(value)) return;
    const updated = value.filter((_, i) => i !== index);
    setFieldValue(name, updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
    multiple,
  });

  // --- CLEAN UP URLs ---
  useEffect(() => {
    return () => {
      value.forEach((file) => {
        if (file instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(file));
        }
      });
    };
  }, [value]);

  // --- GET PREVIEW ---
  const getPreviewUrl = (item: FileOrUrl) => {
    if (item instanceof File) return URL.createObjectURL(item);
    return item; // si viene como string desde el backend
  };

  return (
    <div className={`w-full ${customclass || ""}`}>
      {label && <p className="mb-1 text-sm font-medium">{label}</p>}

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed border-input rounded-md p-6 text-center cursor-pointer transition
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 dark:border-gray-600"}
          ${hasError ? "border-red-500" : ""}
        `}
      >
        <input {...getInputProps()} />

        {/* PREVIEWS */}
        {Array.isArray(value) && value.length > 0 && (
          <>
            <p className="text-muted-foreground text-sm">Archivos seleccionados:</p>

            <div className="my-3 flex flex-wrap justify-center gap-3">
              {value.map((item, i) => {
                const preview = getPreviewUrl(item);

                return (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 group"
                  >
                    <img src={preview} className="w-full h-full object-cover" />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="
                        absolute inset-0 bg-black/50 text-white flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition
                      "
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* TEXTO */}
        {isDragActive ? (
          <p className="text-blue-500">Suelta los archivos aquí...</p>
        ) : (
          <p className="text-muted-foreground">Arrastra y suelta, o haz click para seleccionar</p>
        )}
      </div>

      <ErrorMessage name={name} component="span" className="text-red-500 text-xs mt-1 block" />
    </div>
  );
};

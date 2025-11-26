"use client";
import { useField, useFormikContext, ErrorMessage } from "formik";
import { useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { Trash2 } from "react-feather";

interface DropzoneInputProps {
  name: string;
  label?: string;
  multiple?: boolean;
  acceptedFormats?: Accept;
  customclass?: string;
}

export const DropzoneInput: React.FC<DropzoneInputProps> = ({ name, label, multiple = true, acceptedFormats, customclass }) => {
  const [, meta] = useField<File[] | File | null>(name);
  const { setFieldValue } = useFormikContext();
  const hasError = meta.touched && meta.error;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        const currentFiles = (meta.value as File[]) || [];
        setFieldValue(name, [...currentFiles, ...acceptedFiles]);
      } else {
        setFieldValue(name, acceptedFiles[0]);
      }
    },
    [setFieldValue, name, multiple, meta.value]
  );

  const removeFile = (index: number) => {
    if (!Array.isArray(meta.value)) return;
    const updated = meta.value.filter((_, i) => i !== index);
    setFieldValue(name, updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
    multiple,
  });

  const files = (meta.value as File[]) || [];

  return (
    <div className={`w-full ${customclass || ""}`}>
      {label && <p className="mb-1 text-sm font-medium">{label}</p>}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${hasError ? "border-red-500" : ""}
        `}
      >
        <input {...getInputProps()} />
        {Array.isArray(files) && files.length > 0 && (
          <>
            <p className="text-gray-500 text-sm">Archivos seleccionados:</p>
            <div className="my-3 flex flex-wrap justify-center gap-3">
              {files.map((file, i) => {
                const preview = URL.createObjectURL(file);
                return (
                  <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border group">
                    <picture>
                      <img src={preview} alt={`preview-${i}`} className="w-full h-full object-cover" />
                    </picture>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="absolute top-0 right-0 bg-black/50 text-white w-full h-full flex items-center justify-center text-xs group-hover:opacity-100 opacity-0 transition-all"
                    >
                      <Trash2 />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {isDragActive ? <p className="text-blue-500">Suelta los archivos aquí...</p> : <p className="text-gray-500">Arrastra y suelta archivos aquí, o haz click para seleccionar</p>}
      </div>

      <ErrorMessage name={name} component="span" className="text-red-500 text-xs mt-1 block" />
    </div>
  );
};

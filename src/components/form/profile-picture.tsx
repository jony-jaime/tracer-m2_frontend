"use client";
import { useField, useFormikContext } from "formik";
import { useState } from "react";
import ProfilePictureModal from "./profile-picture-modal";

interface InputProps {
  id?: string;
  label: string;
  name: string;
}

export const ProfilePicture: React.FC<InputProps> = ({ name }) => {
  const [field] = useField<string>(name);
  const { setFieldValue } = useFormikContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 mb-4">
      <button type="button" onClick={() => setIsModalOpen(true)}>
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
          {field.value ? (
            <picture>
              <img
                src={field.value.startsWith("blob:") || field.value.startsWith("http") ? field.value : `${process.env.NEXT_PUBLIC_BASE_URL_STORAGE}/${field.value}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </picture>
          ) : (
            <span className="flex w-full h-full items-center justify-center text-gray-500">No img</span>
          )}
        </div>
      </button>

      <ProfilePictureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialUrl={field.value || undefined}
        onSave={(file: File, previewUrl: string) => {
          setFieldValue("thumbnail", file);
          setFieldValue("thumbnailPreview", previewUrl);
        }}
      />
    </div>
  );
};

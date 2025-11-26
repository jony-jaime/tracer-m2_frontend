"use client";
import { useState, useCallback } from "react";
import { getCroppedImg } from "@/utils/cropImage";
import Cropper, { Area, Point } from "react-easy-crop";
import { Dialog } from "@headlessui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File, previewUrl: string) => void;
  initialUrl?: string;
};

export default function ProfilePictureModal({ isOpen, onClose, onSave }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => setImageSrc(reader.result as string));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
    const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

    const previewUrl = URL.createObjectURL(blob);
    onSave(file, previewUrl);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full">
          <Dialog.Title className="text-lg font-semibold mb-4">Edit profile picture</Dialog.Title>

          <div className="relative w-full h-64 bg-gray-100">
            {imageSrc ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No image selected</div>
            )}
          </div>

          <input lang="en" type="file" accept="image/*" onChange={handleFileChange} className="mt-4" />

          {imageSrc && (
            <div className="mt-4 flex flex-col gap-2">
              <label>Zoom: {zoom.toFixed(1)}</label>
              <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
              <label>Rotate: {rotation}°</label>
              <input type="range" min={0} max={360} step={1} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} />
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-outline-primary !rounded-md !px-4 !py-2">
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="btn btn-primary !px-4 !py-2 !rounded-md">
              Change
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

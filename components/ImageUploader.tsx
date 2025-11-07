import React, { useState, useRef, useEffect } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageUpload: (file: File, dataUrl: string) => void;
  className?: string;
  previewUrl?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageUpload, className = '', previewUrl = null }) => {
  const [preview, setPreview] = useState<string | null>(previewUrl);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(previewUrl);
    if (previewUrl) {
      setFileName('ai-generated-asset.png');
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
      setFileName('');
    }
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreview(dataUrl);
        setFileName(file.name);
        onImageUpload(file, dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setFileName('');
    }
  };
  
  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--rich-blue)]/80 mb-2">
        {label}
      </label>
      <div
        onClick={handleContainerClick}
        className="mt-1 flex justify-center items-center w-full h-48 px-6 pt-5 pb-6 border-2 border-[var(--rich-blue)]/30 border-dashed rounded-xl cursor-pointer bg-white/50 hover:border-[var(--rich-blue)]/60 transition-colors duration-200"
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img src={preview} alt="Preview" className="object-contain w-full h-full rounded-md" />
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-70 text-[var(--rich-blue)] text-xs p-1 truncate rounded-b-md">{fileName}</div>
          </div>
        ) : (
          <div className="space-y-1 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-[var(--rich-blue)]/40" />
            <div className="flex text-sm text-[var(--rich-blue)]/50">
              <p className="pl-1">Click to upload an image</p>
            </div>
            <p className="text-xs text-[var(--rich-blue)]/40">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
       <input
          id={id}
          name={id}
          type="file"
          className="sr-only"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
    </div>
  );
};

export default ImageUploader;
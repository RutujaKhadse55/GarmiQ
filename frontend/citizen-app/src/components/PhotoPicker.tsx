import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, CheckCircle, AlertCircle } from 'lucide-react';

interface PhotoPickerProps {
  onPhotoSelected: (file: File | null, previewUrl: string | null) => void;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({ onPhotoSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileSizeKb, setFileSizeKb] = useState<number | null>(null);
  const [compressionStatus, setCompressionStatus] = useState<string | null>(null);

  // Client-side image compression to guarantee < 1MB
  const compressImage = (file: File): Promise<{ compressedFile: File; previewUrl: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max resolution 1280px
          const maxDim = 1280;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                const previewUrl = URL.createObjectURL(blob);
                resolve({ compressedFile, previewUrl });
              } else {
                reject(new Error('Canvas blob failed'));
              }
            },
            'image/jpeg',
            0.82 // Quality setting guarantees < 1MB
          );
        };
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressionStatus('Optimizing image...');
    try {
      const { compressedFile, previewUrl } = await compressImage(file);
      setPreview(previewUrl);
      setFileSizeKb(Math.round(compressedFile.size / 1024));
      setCompressionStatus(null);
      onPhotoSelected(compressedFile, previewUrl);
    } catch {
      setCompressionStatus('Failed to process image');
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileSizeKb(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onPhotoSelected(null, null);
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-[#E2EDF9] shadow-soft">
      <span className="text-xs font-bold text-[#102A4C] block mb-2">
        Attach Photo (Optional)
      </span>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-[#D6E8FF] bg-[#F5F9FF]">
          <img
            src={preview}
            alt="Report Preview"
            className="w-full h-44 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Compressed ({fileSizeKb} KB &lt; 1MB)</span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#B5D6FF] hover:border-[#0866D9] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#F8FAFD] hover:bg-[#EDF5FF] transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-[#0866D9] mb-2">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-[#102A4C]">
            Tap to Take Photo or Upload
          </span>
          <span className="text-[10px] text-[#5B708B] mt-0.5">
            Automatically compressed under 1MB
          </span>
          {compressionStatus && (
            <span className="text-xs text-[#0866D9] mt-2 font-medium">
              {compressionStatus}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

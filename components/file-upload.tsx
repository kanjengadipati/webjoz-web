"use client";

import React, { useRef, useState } from "react";
import { Upload, Loader2, Link2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";

interface FileUploadProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  accept?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

// Client-side image compression helper using Canvas
function compressImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<File | Blob> {
  return new Promise((resolve) => {
    // Only compress standard image files, skip icons, SVGs, etc.
    if (!file.type.startsWith("image/") || file.type === "image/x-icon" || file.type === "image/svg+xml") {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Apply aspect ratio scale if original size exceeds target constraints
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const bestRatio = Math.min(widthRatio, heightRatio);

          width = Math.round(width * bestRatio);
          height = Math.round(height * bestRatio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export default function FileUpload({
  label,
  value,
  onChange,
  placeholder = "https://example.com/image.png",
  accept = "image/*",
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.8,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setStatus("idle");

    if (!cloudName || !uploadPreset) {
      setError("Konfigurasi Cloudinary belum lengkap di env.");
      setStatus("error");
      return;
    }

    try {
      setUploading(true);

      // Perform local image compression
      const processedFile = await compressImage(file, maxWidth, maxHeight, quality);

      const formData = new FormData();
      formData.append("file", processedFile);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error?.message || "Gagal mengupload gambar ke Cloudinary.");
      }

      const body = await res.json();
      if (!body.secure_url) {
        throw new Error("Format respon Cloudinary tidak valid.");
      }

      onChange(body.secure_url);
      setStatus("success");

      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal mengunggah file.");
      setStatus("error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-500">{label}</label>
        {uploading && (
          <span className="text-[10px] text-cyan-600 font-medium flex items-center gap-1 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Mengompres & Mengunggah...
          </span>
        )}
        {status === "success" && (
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <Check className="w-3.5 h-3.5" />
            Berhasil diunggah!
          </span>
        )}
        {status === "error" && (
          <span className="text-[10px] text-red-600 font-semibold flex items-center gap-0.5" title={error || ""}>
            <AlertCircle className="w-3.5 h-3.5" />
            Gagal upload
          </span>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1 flex items-center">
          <Link2 className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs outline-none focus:border-primary transition-all bg-white text-slate-800"
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          onClick={triggerSelectFile}
          disabled={uploading}
          className="h-8.5 rounded-xl text-xs gap-1.5 px-3 hover:bg-slate-50 border border-slate-200 transition-all font-semibold flex items-center shrink-0 cursor-pointer shadow-sm"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
          ) : (
            <Upload className="w-3.5 h-3.5 text-slate-500" />
          )}
          Pilih File
        </Button>
      </div>

      {error && (
        <p className="text-[10px] text-red-500 font-medium pl-1 leading-normal">
          {error}
        </p>
      )}
    </div>
  );
}

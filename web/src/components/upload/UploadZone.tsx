"use client";

import React, { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { UploadCloud, FileImage, X, AlertCircle, Loader2, Download as DownloadIcon, Check, Camera, Pencil } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileWithStatus } from "@/lib/types";
import { formatFileSize } from "@/lib/utils";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const MAX_FILES = 20;
const MAX_SIZE = 25 * 1024 * 1024;

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/heic": [".heic"],
  "image/heif": [".heif"],
  "image/gif": [".gif"],
  "image/bmp": [".bmp"],
  "image/tiff": [".tiff", ".tif"],
};

interface UploadZoneProps {
  files: FileWithStatus[];
  onFilesAdded: (files: File[]) => void;
  onFileRemove: (id: string) => void;
  onFileDownload?: (file: FileWithStatus) => void;
  onFilePreview?: (file: FileWithStatus) => void;
  onFileEdit?: (file: FileWithStatus) => void;
}

export default function UploadZone({ files, onFilesAdded, onFileRemove, onFileDownload, onFilePreview, onFileEdit }: UploadZoneProps) {
  const [error, setError] = React.useState<string | null>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const capturedFiles = e.target.files;
    if (capturedFiles && capturedFiles.length > 0) {
      onFilesAdded(Array.from(capturedFiles));
    }
    e.target.value = '';
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null);

    if (files.length + acceptedFiles.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed.`);
      return;
    }

    if (fileRejections.length > 0) {
      const firstError = fileRejections[0].errors[0];
      if (firstError.code === "file-too-large") {
        setError(`File too large. Max 25MB.`);
      } else if (firstError.code === "file-invalid-type") {
        setError("Invalid file type.");
      } else {
        setError(firstError.message);
      }
      return;
    }

    onFilesAdded(acceptedFiles);
  }, [files, onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    maxFiles: MAX_FILES,
  });

  return (
    <div className="w-full space-y-4">
      {/* Hidden camera input for mobile */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer flex flex-col items-center justify-center w-full py-8 sm:py-12 rounded-xl border-2 border-dashed transition-colors",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-200 hover:border-slate-300 bg-white",
          error && "border-red-300 bg-red-50"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center text-center space-y-4 px-4">
          <div className={cn(
            "p-4 rounded-full",
            isDragActive ? "bg-blue-100" : "bg-slate-100"
          )}>
            <UploadCloud className={cn(
              "w-8 h-8",
              isDragActive ? "text-blue-600" : "text-slate-400"
            )} />
          </div>

          <div>
            <p className="text-base font-medium text-slate-700">
              {isDragActive ? "Drop files here" : "Drop images or tap to upload"}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              HEIC, PNG, JPG, WebP up to 25MB
            </p>
          </div>

          {/* Camera button for mobile */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              cameraInputRef.current?.click();
            }}
            className="sm:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium active:bg-slate-200 transition-colors"
          >
            <Camera className="w-5 h-5" />
            Take Photo
          </button>

          {error && (
            <div className="flex items-center gap-1.5 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {files.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-lg bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow transition-shadow"
            >
              {/* Thumbnail */}
              <div
                className="aspect-square relative cursor-pointer"
                onClick={() => onFilePreview?.(item)}
              >
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <FileImage className="w-8 h-8 text-slate-300" />
                  </div>
                )}

                {/* Status badge */}
                {item.status === 'converting' && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  </div>
                )}
                {item.status === 'success' && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                {item.status === 'error' && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center" title={item.error}>
                    <AlertCircle className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Progress bar */}
                {item.status === 'converting' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${Math.max(5, item.progress)}%` }}
                    />
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="p-2">
                <p className="text-xs font-medium text-slate-700 truncate" title={item.file.name}>
                  {item.file.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-400">
                    {formatFileSize(item.file.size)}
                    {item.status === 'success' && item.convertedSize && (
                      <span className="text-green-600 ml-1">
                        → {formatFileSize(item.convertedSize)}
                      </span>
                    )}
                  </span>

                  {/* Actions - touch-optimized */}
                  <div className="flex items-center">
                    {/* Edit button - only for idle images with preview */}
                    {item.status === 'idle' && item.previewUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileEdit?.(item);
                        }}
                        className="p-2 -m-1 rounded-lg hover:bg-slate-100 active:bg-slate-200 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {item.status === 'success' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileDownload?.(item);
                        }}
                        className="p-2 -m-1 rounded-lg hover:bg-slate-100 active:bg-slate-200 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Download"
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFileRemove(item.id);
                      }}
                      className="p-2 -m-1 rounded-lg hover:bg-slate-100 active:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

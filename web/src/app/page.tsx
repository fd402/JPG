"use client";

import { useState, useCallback, useEffect } from "react";
import UploadZone from "@/components/upload/UploadZone";
import { FormatSelector, TargetFormat } from "@/components/upload/FormatSelector";
import { FileWithStatus } from "@/lib/types";
import { convertImage } from "@/lib/converter";
import { Download as DownloadIcon, FileText } from "lucide-react";
import { ImagePreviewModal } from "@/components/preview";
import { ImageEditor } from "@/components/editor";
import { AdBanner } from "@/components/ads/AdBanner";

export default function Home() {
  const [targetFormat, setTargetFormat] = useState<TargetFormat>("png");
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileWithStatus | null>(null);
  const [editFile, setEditFile] = useState<FileWithStatus | null>(null);
  const [quality, setQuality] = useState(90);

  // Calculate total file size for estimation
  const totalFileSize = files.reduce((sum, f) => sum + f.file.size, 0);

  // Generate preview URL for a file
  const generatePreviewUrl = useCallback(async (file: File): Promise<string> => {
    // For HEIC/HEIF files, we need to convert first to display preview
    const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
      file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');

    if (isHeic) {
      try {
        const previewBlob = await convertImage(file, 'jpg');
        return URL.createObjectURL(previewBlob);
      } catch {
        return '';
      }
    }
    return URL.createObjectURL(file);
  }, []);

  const handleFilesAdded = async (newFiles: File[]) => {
    const filesWithStatus: FileWithStatus[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "idle",
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...filesWithStatus]);

    // Generate preview URLs for each file
    for (const fileItem of filesWithStatus) {
      const previewUrl = await generatePreviewUrl(fileItem.file);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id ? { ...f, previewUrl } : f
        )
      );
    }
  };

  const handleFileRemove = (id: string) => {
    // Clean up object URLs before removing
    const fileToRemove = files.find((f) => f.id === id);
    if (fileToRemove?.previewUrl) URL.revokeObjectURL(fileToRemove.previewUrl);
    if (fileToRemove?.convertedPreviewUrl) URL.revokeObjectURL(fileToRemove.convertedPreviewUrl);

    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    const currentFiles = files;
    return () => {
      currentFiles.forEach((f) => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
        if (f.convertedPreviewUrl) URL.revokeObjectURL(f.convertedPreviewUrl);
      });
    };
  }, [files]);

  const startConversion = async () => {
    setIsConverting(true);

    // Process files sequentially or in small batches to avoid freezing UI
    for (const fileItem of files) {
      if (fileItem.status === "success") continue; // Skip already converted

      // Update status to converting
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id ? { ...f, status: "converting", progress: 10 } : f
        )
      );

      try {
        // Simulate progress for UX (since actual conversion is one async block)
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id && f.status === 'converting' && f.progress < 90
                ? { ...f, progress: f.progress + 10 }
                : f
            )
          );
        }, 200);

        const resultBlob = await convertImage(fileItem.file, targetFormat, quality);
        const convertedPreviewUrl = URL.createObjectURL(resultBlob);

        clearInterval(progressInterval);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? {
                ...f,
                status: "success",
                progress: 100,
                resultBlob,
                convertedPreviewUrl,
                convertedSize: resultBlob.size,
                outputName: (f.file.name.replace(/\.[^/.]+$/, "") || "converted_image") + `.${targetFormat === 'jpg' ? 'jpg' : targetFormat}`,
              }
              : f
          )
        );
      } catch (error) {
        console.error("Conversion failed", error);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: "error", error: "Conversion failed" }
              : f
          )
        );
      }
    }
    setIsConverting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center gap-8 w-full max-w-3xl text-center">

        {/* Header Ad Banner */}
        <AdBanner position="header" adSlot="header-banner" />

        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900">
            Convert Images <br />
            <span className="text-blue-600">Instantly</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Convert HEIC, WEBP, and PNG files. Fast, private, and free.
          </p>
        </div>

        {/* Format Selection */}
        <div className="w-full">
          <FormatSelector
            selectedFormat={targetFormat}
            onSelect={setTargetFormat}
            quality={quality}
            onQualityChange={setQuality}
            totalFileSize={totalFileSize > 0 ? totalFileSize : undefined}
          />
        </div>

        {/* Upload Component */}
        <div className="w-full">
          <UploadZone
            files={files}
            onFilesAdded={handleFilesAdded}
            onFileRemove={handleFileRemove}
            onFileDownload={async (file) => {
              if (file.resultBlob && file.outputName) {
                const { downloadBlob } = await import("@/lib/download");
                downloadBlob(file.resultBlob, file.outputName);
              }
            }}
            onFilePreview={(file) => setPreviewFile(file)}
            onFileEdit={(file) => setEditFile(file)}
          />
        </div>

        {/* Convert / Download Button */}
        {files.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
            {/* Convert Button */}
            {!isConverting && files.some(f => f.status !== 'success') && (
              <button
                onClick={startConversion}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 bg-blue-600 text-white rounded-xl sm:rounded-lg font-medium shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                Convert {files.length} Image{files.length !== 1 ? 's' : ''}
              </button>
            )}

            {/* Converting State */}
            {isConverting && (
              <button disabled className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 bg-slate-100 text-slate-400 rounded-xl sm:rounded-lg font-medium cursor-not-allowed">
                <span className="animate-spin w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full" />
                Converting...
              </button>
            )}

            {/* Download Button */}
            {files.some(f => f.status === 'success') && !isConverting && (
              <button
                onClick={async () => {
                  const successFiles = files.filter(f => f.status === 'success');
                  if (successFiles.length === 1) {
                    const { downloadBlob } = await import("@/lib/download");
                    const file = successFiles[0];
                    if (file.resultBlob && file.outputName) {
                      downloadBlob(file.resultBlob, file.outputName);
                    }
                  } else {
                    const { downloadZip } = await import("@/lib/download");
                    downloadZip(files);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 bg-slate-900 text-white rounded-xl sm:rounded-lg font-medium hover:bg-slate-800 active:bg-slate-700 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                {files.filter(f => f.status === 'success').length === 1 ? 'Download' : 'Download All'}
              </button>
            )}

            {/* PDF Export Button */}
            {files.some(f => f.status === 'success') && !isConverting && (
              <button
                onClick={async () => {
                  const { generatePdf, downloadPdf } = await import("@/lib/pdf");
                  const pdfBlob = await generatePdf(files);
                  downloadPdf(pdfBlob, "converted-images.pdf");
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 border border-slate-200 bg-white text-slate-700 rounded-xl sm:rounded-lg font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
            )}
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-400">
          <span>Fast local processing</span>
          <span className="hidden sm:inline">•</span>
          <span>Files stay on your device</span>
          <span className="hidden sm:inline">•</span>
          <span>High quality output</span>
        </div>

        {/* Footer Ad Banner */}
        <AdBanner position="footer" adSlot="footer-banner" />
      </main>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        file={previewFile}
        isOpen={previewFile !== null}
        onClose={() => setPreviewFile(null)}
      />

      {/* Image Editor Modal */}
      {editFile && editFile.previewUrl && (
        <ImageEditor
          imageUrl={editFile.previewUrl}
          imageBlob={editFile.file}
          isOpen={editFile !== null}
          onClose={() => setEditFile(null)}
          onSave={(editedBlob, editedUrl) => {
            // Update the file with edited version
            setFiles((prev) =>
              prev.map((f) =>
                f.id === editFile.id
                  ? {
                    ...f,
                    file: new File([editedBlob], f.file.name, { type: editedBlob.type }),
                    previewUrl: editedUrl,
                  }
                  : f
              )
            );
            setEditFile(null);
          }}
        />
      )}
    </div>
  );
}

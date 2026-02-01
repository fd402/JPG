"use client";

import { useState, useCallback, useEffect } from "react";
import UploadZone from "@/components/upload/UploadZone";
import { FormatSelector, TargetFormat } from "@/components/upload/FormatSelector";
import { FileWithStatus } from "@/lib/types";
import { convertImage } from "@/lib/converter";
import { Download as DownloadIcon, FileText, Zap, ShieldCheck, RefreshCw, CreditCard } from "lucide-react";
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
      {/* Sidebar Ads - visible on desktop only */}
      <AdBanner position="left" />
      <AdBanner position="right" />

      <main className="flex flex-col items-center gap-8 w-full max-w-3xl text-center">

        {/* Header Ad Banner - visible on mobile only */}
        <AdBanner position="header" />

        {/* Header Section */}
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <img
              src="/logo.png"
              alt="PicSwitch"
              className="w-14 h-14 rounded-2xl shadow-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              PicSwitch
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900">
            Convert Images <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Instantly</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Convert HEIC, WEBP, JPG and PNG files. Fast, private, and free.
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

        {/* SEO Content Section */}
        <div className="mt-12 w-full text-left bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-100">
          <div className="space-y-20">

            {/* Guide Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-10 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-900/5">
                  <FileText className="w-5 h-5" />
                </span>
                How to Convert
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
                <div className="relative pl-6 border-l-2 border-slate-200 transition-all hover:border-blue-500 group cursor-default">
                  <span className="text-[10px] font-bold tracking-widest text-blue-600 mb-2 block uppercase opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Phase 01</span>
                  <strong className="text-slate-900 font-bold text-lg block mb-2 group-hover:text-blue-600 transition-colors">Upload</strong>
                  <p className="text-slate-500 text-sm leading-relaxed">Drag & drop files or click to select. We support large batches.</p>
                </div>

                <div className="relative pl-6 border-l-2 border-slate-200 transition-all hover:border-blue-500 group cursor-default">
                  <span className="text-[10px] font-bold tracking-widest text-blue-600 mb-2 block uppercase opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Phase 02</span>
                  <strong className="text-slate-900 font-bold text-lg block mb-2 group-hover:text-blue-600 transition-colors">Select Detail</strong>
                  <p className="text-slate-500 text-sm leading-relaxed">Choose JPG, PNG, or WebP. Adjust quality if needed.</p>
                </div>

                <div className="relative pl-6 border-l-2 border-slate-200 transition-all hover:border-blue-500 group cursor-default">
                  <span className="text-[10px] font-bold tracking-widest text-blue-600 mb-2 block uppercase opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Phase 03</span>
                  <strong className="text-slate-900 font-bold text-lg block mb-2 group-hover:text-blue-600 transition-colors">Convert</strong>
                  <p className="text-slate-500 text-sm leading-relaxed">Lightning fast processing happens directly in your browser.</p>
                </div>

                <div className="relative pl-6 border-l-2 border-slate-200 transition-all hover:border-blue-500 group cursor-default">
                  <span className="text-[10px] font-bold tracking-widest text-blue-600 mb-2 block uppercase opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Phase 04</span>
                  <strong className="text-slate-900 font-bold text-lg block mb-2 group-hover:text-blue-600 transition-colors">Save</strong>
                  <p className="text-slate-500 text-sm leading-relaxed">Download individual images or get everything as a ZIP.</p>
                </div>
              </div>
            </section>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Benefits Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-10">Why PicSwitch?</h2>
              <div className="grid sm:grid-cols-2 gap-x-16 gap-y-12">
                <div className="flex gap-5 group">
                  <div className="flex-none w-12 h-12 rounded-2xl bg-white text-emerald-500 shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">Free Forever</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      No limits. No paywalls. No watermarks. Just open and convert.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 group">
                  <div className="flex-none w-12 h-12 rounded-2xl bg-white text-blue-500 shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">100% Private</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Files never leave your device. Processing happens locally via WebAssembly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 group">
                  <div className="flex-none w-12 h-12 rounded-2xl bg-white text-amber-500 shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">Blazing Fast</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Zero latency. Works instantly without uploading/downloading large files.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 group">
                  <div className="flex-none w-12 h-12 rounded-2xl bg-white text-indigo-500 shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">Universal Support</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Convert between HEIC, WebP, JPG, and PNG formats seamlessly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-10">FAQ</h2>
              <div className="grid sm:grid-cols-2 gap-10">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-3">Is it really free?</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Yes. We believe basic tools should be free. No hidden costs.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-3">Is it safe?</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Yes. We don't have servers to store your images. Everything stays on your computer.
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer Ad Banner - visible on mobile only */}
        <AdBanner position="footer" />

        {/* Footer Links */}
        <footer className="mt-8 pt-6 border-t border-slate-200 w-full text-center">
          <div className="flex justify-center gap-6 text-sm text-slate-400">
            <a href="/legal" className="hover:text-slate-600 transition-colors">Legal Notice</a>
            <span>•</span>
            <a href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          </div>
          <p className="mt-3 text-xs text-slate-300">© 2026 PicSwitch. All rights reserved.</p>
        </footer>
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

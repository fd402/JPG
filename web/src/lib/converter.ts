import { TargetFormat } from "@/components/upload/FormatSelector";

export interface ConversionOptions {
    format: TargetFormat;
    quality?: number; // 1-100, only applies to jpg and webp
}

export async function convertImage(file: File, format: TargetFormat, quality: number = 90): Promise<Blob> {
    // Normalize quality to 0-1 range for APIs
    const normalizedQuality = Math.max(0.01, Math.min(1, quality / 100));

    console.log(`Starting conversion: ${file.name} (${file.type}) -> ${format} (quality: ${quality}%)`);

    // Handle HEIC/HEIF files specifically
    if (
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif")
    ) {
        console.log("Detected HEIC/HEIF, using heic2any");
        try {
            const heic2any = (await import("heic2any")).default;
            const conversionResult = await heic2any({
                blob: file,
                toType: `image/${format === "jpg" ? "jpeg" : format}`,
                quality: format === "png" ? 1 : normalizedQuality,
            });

            const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
            console.log("HEIC conversion successful", blob);
            return blob;
        } catch (e) {
            console.error("HEIC conversion failed", e);
            throw ignoredError(e);
        }
    }

    // For other formats, use Canvas
    return new Promise((resolve, reject) => {
        console.log("Using Canvas fallback for", file.type);
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement("canvas");
            // Set canvas size
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            // Draw white background for transparent images converting to JPG
            if (format === "jpg") {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
            console.log(`Converting to blob: ${mimeType}`);

            // PNG is lossless, so quality doesn't apply
            const blobQuality = format === "png" ? undefined : normalizedQuality;

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        console.log("Canvas conversion successful", blob);
                        resolve(blob);
                    } else {
                        reject(new Error("Canvas conversion resulted in null blob"));
                    }
                },
                mimeType,
                blobQuality
            );
        };

        img.onerror = (e) => {
            URL.revokeObjectURL(url);
            console.error("Failed to load image for canvas", e);
            reject(new Error(`Failed to load image: ${file.name}`));
        };

        img.src = url;
    });
}

function ignoredError(e: unknown): Error {
    return e instanceof Error ? e : new Error(String(e));
}

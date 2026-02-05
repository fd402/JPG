import JSZip from "jszip";
import { FileWithStatus } from "./types";

export function downloadBlob(blob: Blob, filename: string) {
    console.log("Attempting download:", { filename, blobSize: blob.size, blobType: blob.type });

    // Validate blob
    if (!blob || blob.size === 0) {
        console.error("Cannot download empty blob");
        alert("Error: The file meant for download is empty.");
        return;
    }

    // Create object URL from the original blob
    // We do NOT force "application/octet-stream" unless absolutely necessary,
    // as it can confuse browsers if they ignore the filename attribute.
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // This attribute should be sufficient
    a.style.display = "none";
    document.body.appendChild(a);

    // Standard click
    a.click();

    // Cleanup after small delay
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

export async function downloadZip(files: FileWithStatus[]) {
    const zip = new JSZip();
    let count = 0;

    files.forEach((file) => {
        if (file.status === "success" && file.resultBlob && file.outputName) {
            zip.file(file.outputName, file.resultBlob);
            count++;
        }
    });

    if (count === 0) {
        console.warn("No files to zip");
        alert("No files ready for download.");
        return;
    }

    try {
        const content = await zip.generateAsync({ type: "blob" });
        console.log("Generated ZIP:", { size: content.size });
        downloadBlob(content, "converted_images.zip");
    } catch (e) {
        console.error("Failed to generate zip", e);
        alert("Failed to create ZIP file.");
    }
}

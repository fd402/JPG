import { jsPDF } from "jspdf";
import { FileWithStatus } from "./types";

export type PageFormat = "a4" | "letter" | "original";
export type PageOrientation = "portrait" | "landscape" | "auto";

export interface PdfOptions {
    format: PageFormat;
    orientation: PageOrientation;
    margin: number; // in mm
}

const PAGE_SIZES = {
    a4: { width: 210, height: 297 },
    letter: { width: 215.9, height: 279.4 },
};

async function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = dataUrl;
    });
}

export async function generatePdf(
    files: FileWithStatus[],
    options: PdfOptions = { format: "a4", orientation: "auto", margin: 10 }
): Promise<Blob> {
    const successFiles = files.filter(f => f.status === "success" && f.resultBlob);

    if (successFiles.length === 0) {
        throw new Error("No converted images to export");
    }

    // Process first image to determine initial orientation
    const firstDataUrl = await blobToDataUrl(successFiles[0].resultBlob!);
    const firstDimensions = await getImageDimensions(firstDataUrl);

    const getOrientation = (width: number, height: number): "portrait" | "landscape" => {
        if (options.orientation === "auto") {
            return width > height ? "landscape" : "portrait";
        }
        return options.orientation as "portrait" | "landscape";
    };

    const initialOrientation = getOrientation(firstDimensions.width, firstDimensions.height);

    // Create PDF
    const pdf = new jsPDF({
        orientation: initialOrientation,
        unit: "mm",
        format: options.format === "original" ? [firstDimensions.width * 0.264583, firstDimensions.height * 0.264583] : options.format,
    });

    for (let i = 0; i < successFiles.length; i++) {
        const file = successFiles[i];
        const dataUrl = i === 0 ? firstDataUrl : await blobToDataUrl(file.resultBlob!);
        const dimensions = i === 0 ? firstDimensions : await getImageDimensions(dataUrl);

        if (i > 0) {
            const pageOrientation = getOrientation(dimensions.width, dimensions.height);
            if (options.format === "original") {
                pdf.addPage([dimensions.width * 0.264583, dimensions.height * 0.264583], pageOrientation);
            } else {
                pdf.addPage(options.format, pageOrientation);
            }
        }

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = options.margin;

        const availableWidth = pageWidth - (margin * 2);
        const availableHeight = pageHeight - (margin * 2);

        // Calculate scaled dimensions to fit page
        const imgRatio = dimensions.width / dimensions.height;
        const pageRatio = availableWidth / availableHeight;

        let imgWidth: number;
        let imgHeight: number;

        if (imgRatio > pageRatio) {
            imgWidth = availableWidth;
            imgHeight = availableWidth / imgRatio;
        } else {
            imgHeight = availableHeight;
            imgWidth = availableHeight * imgRatio;
        }

        // Center image on page
        const x = margin + (availableWidth - imgWidth) / 2;
        const y = margin + (availableHeight - imgHeight) / 2;

        pdf.addImage(dataUrl, "JPEG", x, y, imgWidth, imgHeight);
    }

    return pdf.output("blob");
}

export function downloadPdf(blob: Blob, filename: string = "images.pdf") {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

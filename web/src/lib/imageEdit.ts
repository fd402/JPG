export interface ImageDimensions {
    width: number;
    height: number;
}

export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type RotationAngle = 0 | 90 | 180 | 270;

async function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

export async function getImageDimensions(blob: Blob): Promise<ImageDimensions> {
    const url = URL.createObjectURL(blob);
    try {
        const img = await loadImage(url);
        return { width: img.width, height: img.height };
    } finally {
        URL.revokeObjectURL(url);
    }
}

export async function resizeImage(
    blob: Blob,
    newWidth: number,
    newHeight: number,
    maintainAspectRatio: boolean = true
): Promise<Blob> {
    const url = URL.createObjectURL(blob);
    try {
        const img = await loadImage(url);

        let targetWidth = newWidth;
        let targetHeight = newHeight;

        if (maintainAspectRatio) {
            const aspectRatio = img.width / img.height;
            if (newWidth / newHeight > aspectRatio) {
                targetWidth = Math.round(newHeight * aspectRatio);
            } else {
                targetHeight = Math.round(newWidth / aspectRatio);
            }
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (result) => {
                    if (result) resolve(result);
                    else reject(new Error("Failed to create blob"));
                },
                blob.type || "image/jpeg",
                0.92
            );
        });
    } finally {
        URL.revokeObjectURL(url);
    }
}

export async function cropImage(blob: Blob, cropArea: CropArea): Promise<Blob> {
    const url = URL.createObjectURL(blob);
    try {
        const img = await loadImage(url);

        const canvas = document.createElement("canvas");
        canvas.width = cropArea.width;
        canvas.height = cropArea.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        ctx.drawImage(
            img,
            cropArea.x,
            cropArea.y,
            cropArea.width,
            cropArea.height,
            0,
            0,
            cropArea.width,
            cropArea.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (result) => {
                    if (result) resolve(result);
                    else reject(new Error("Failed to create blob"));
                },
                blob.type || "image/jpeg",
                0.92
            );
        });
    } finally {
        URL.revokeObjectURL(url);
    }
}

export async function rotateImage(blob: Blob, angle: RotationAngle): Promise<Blob> {
    if (angle === 0) return blob;

    const url = URL.createObjectURL(blob);
    try {
        const img = await loadImage(url);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        // Swap dimensions for 90/270 degree rotations
        if (angle === 90 || angle === 270) {
            canvas.width = img.height;
            canvas.height = img.width;
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (result) => {
                    if (result) resolve(result);
                    else reject(new Error("Failed to create blob"));
                },
                blob.type || "image/jpeg",
                0.92
            );
        });
    } finally {
        URL.revokeObjectURL(url);
    }
}

export function calculateAspectRatio(width: number, height: number): number {
    return width / height;
}

export function calculateNewDimensions(
    originalWidth: number,
    originalHeight: number,
    targetWidth: number | null,
    targetHeight: number | null,
    maintainAspectRatio: boolean
): ImageDimensions {
    if (!maintainAspectRatio) {
        return {
            width: targetWidth || originalWidth,
            height: targetHeight || originalHeight,
        };
    }

    const aspectRatio = originalWidth / originalHeight;

    if (targetWidth && !targetHeight) {
        return {
            width: targetWidth,
            height: Math.round(targetWidth / aspectRatio),
        };
    }

    if (targetHeight && !targetWidth) {
        return {
            width: Math.round(targetHeight * aspectRatio),
            height: targetHeight,
        };
    }

    if (targetWidth && targetHeight) {
        // Fit within bounds while maintaining aspect ratio
        if (targetWidth / targetHeight > aspectRatio) {
            return {
                width: Math.round(targetHeight * aspectRatio),
                height: targetHeight,
            };
        } else {
            return {
                width: targetWidth,
                height: Math.round(targetWidth / aspectRatio),
            };
        }
    }

    return { width: originalWidth, height: originalHeight };
}

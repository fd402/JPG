export type FileStatus = 'idle' | 'converting' | 'success' | 'error';

export interface FileWithStatus {
    id: string;
    file: File;
    status: FileStatus;
    progress: number;
    resultBlob?: Blob;
    error?: string;
    outputName?: string;
    previewUrl?: string;
    convertedPreviewUrl?: string;
    convertedSize?: number;
}

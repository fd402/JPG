"use client";

import React from "react";
import { FileImage, Loader2, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileStatus } from "@/lib/types";

interface ThumbnailProps {
    previewUrl?: string;
    fileName: string;
    status: FileStatus;
    onClick?: () => void;
    className?: string;
}

export function Thumbnail({ previewUrl, fileName, status, onClick, className }: ThumbnailProps) {
    const getFileExtension = (name: string) => {
        const ext = name.split('.').pop()?.toUpperCase() || '';
        return ext.length > 4 ? ext.slice(0, 4) : ext;
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative aspect-square rounded-lg overflow-hidden bg-white/5 cursor-pointer group",
                "border border-white/10 hover:border-white/30 transition-all duration-200",
                onClick && "hover:scale-[1.02]",
                className
            )}
        >
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt={fileName}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <FileImage className="w-8 h-8 text-white/30" />
                </div>
            )}

            {/* File extension badge */}
            <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                {getFileExtension(fileName)}
            </div>

            {/* Status overlay */}
            {status === 'converting' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                </div>
            )}
            {status === 'success' && (
                <div className="absolute top-1 right-1 p-1 rounded-full bg-green-500/90 backdrop-blur-sm">
                    <Check className="w-3 h-3 text-white" />
                </div>
            )}
            {status === 'error' && (
                <div className="absolute top-1 right-1 p-1 rounded-full bg-red-500/90 backdrop-blur-sm">
                    <AlertCircle className="w-3 h-3 text-white" />
                </div>
            )}

            {/* Hover overlay with "Preview" text */}
            {onClick && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Preview
                    </span>
                </div>
            )}
        </div>
    );
}

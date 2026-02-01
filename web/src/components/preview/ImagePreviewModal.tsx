"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { cn, formatFileSize, calculateSizeChange } from "@/lib/utils";
import { FileWithStatus } from "@/lib/types";

interface ImagePreviewModalProps {
    file: FileWithStatus | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ImagePreviewModal({ file, isOpen, onClose }: ImagePreviewModalProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !file) return null;

    const hasConversion = file.status === 'success' && file.convertedPreviewUrl;
    const originalSize = file.file.size;
    const convertedSize = file.convertedSize || 0;
    const sizeChange = hasConversion ? calculateSizeChange(originalSize, convertedSize) : null;

    const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging && e.type === 'mousemove') return;

        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const position = ((clientX - rect.left) / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, position)));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="text-base font-medium text-slate-900 truncate max-w-[400px]" title={file.file.name}>
                        {file.file.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {hasConversion ? (
                        /* Slider comparison view */
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-slate-500">
                                <span>Original ({formatFileSize(originalSize)})</span>
                                <div className="flex items-center gap-2">
                                    <span>Converted ({formatFileSize(convertedSize)})</span>
                                    {sizeChange && (
                                        <span className={cn(
                                            "flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded",
                                            sizeChange.reduced
                                                ? "bg-green-50 text-green-600"
                                                : "bg-orange-50 text-orange-600"
                                        )}>
                                            {sizeChange.reduced ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                            {sizeChange.percentage}%
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div
                                className="relative aspect-[4/3] bg-slate-50 rounded-lg overflow-hidden cursor-ew-resize select-none"
                                onMouseDown={() => setIsDragging(true)}
                                onMouseUp={() => setIsDragging(false)}
                                onMouseLeave={() => setIsDragging(false)}
                                onMouseMove={handleSliderMove}
                                onTouchMove={handleSliderMove}
                                onClick={handleSliderMove}
                            >
                                {/* Converted (bottom) */}
                                <img
                                    src={file.convertedPreviewUrl}
                                    alt="Converted"
                                    className="absolute inset-0 w-full h-full object-contain"
                                    draggable={false}
                                />

                                {/* Original (clipped) */}
                                <div
                                    className="absolute inset-0 overflow-hidden"
                                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                >
                                    <img
                                        src={file.previewUrl}
                                        alt="Original"
                                        className="w-full h-full object-contain"
                                        draggable={false}
                                    />
                                </div>

                                {/* Slider */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-blue-500"
                                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                                >
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 shadow flex items-center justify-center">
                                        <div className="flex gap-0.5">
                                            <div className="w-0.5 h-2 bg-white rounded-full" />
                                            <div className="w-0.5 h-2 bg-white rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                {/* Labels */}
                                <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-white/90 text-xs text-slate-600 shadow-sm">
                                    Original
                                </div>
                                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-white/90 text-xs text-slate-600 shadow-sm">
                                    Converted
                                </div>
                            </div>
                            <p className="text-center text-xs text-slate-400">
                                Drag to compare
                            </p>
                        </div>
                    ) : (
                        /* Single image */
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-slate-500">
                                <span>Original</span>
                                <span>{formatFileSize(originalSize)}</span>
                            </div>
                            <div className="relative aspect-[4/3] bg-slate-50 rounded-lg overflow-hidden">
                                {file.previewUrl ? (
                                    <img
                                        src={file.previewUrl}
                                        alt={file.file.name}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        Preview not available
                                    </div>
                                )}
                            </div>
                            {file.status === 'idle' && (
                                <p className="text-center text-sm text-slate-400">
                                    Convert to see comparison
                                </p>
                            )}
                            {file.status === 'converting' && (
                                <p className="text-center text-sm text-blue-600">
                                    Converting...
                                </p>
                            )}
                            {file.status === 'error' && (
                                <p className="text-center text-sm text-red-600">
                                    {file.error || 'Conversion failed'}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {hasConversion && sizeChange && (
                    <div className="px-4 pb-4">
                        <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-slate-50 text-sm">
                            <span className="text-slate-600">{formatFileSize(originalSize)}</span>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">{formatFileSize(convertedSize)}</span>
                            <span className={cn(
                                "font-medium",
                                sizeChange.reduced ? "text-green-600" : "text-orange-600"
                            )}>
                                ({sizeChange.reduced ? '-' : '+'}{sizeChange.percentage}%)
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

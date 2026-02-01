"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, RotateCcw, RotateCw, Maximize2, Crop } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    resizeImage,
    rotateImage,
    getImageDimensions,
    ImageDimensions,
    RotationAngle,
} from "@/lib/imageEdit";

type EditorTab = "resize" | "rotate";

interface ImageEditorProps {
    imageUrl: string;
    imageBlob: Blob;
    isOpen: boolean;
    onClose: () => void;
    onSave: (editedBlob: Blob, editedUrl: string) => void;
}

export function ImageEditor({ imageUrl, imageBlob, isOpen, onClose, onSave }: ImageEditorProps) {
    const [activeTab, setActiveTab] = useState<EditorTab>("resize");
    const [isProcessing, setIsProcessing] = useState(false);

    // Original dimensions
    const [originalDimensions, setOriginalDimensions] = useState<ImageDimensions | null>(null);

    // Resize state
    const [resizeWidth, setResizeWidth] = useState<number>(0);
    const [resizeHeight, setResizeHeight] = useState<number>(0);
    const [maintainAspect, setMaintainAspect] = useState(true);

    // Rotation state
    const [rotation, setRotation] = useState<RotationAngle>(0);

    // Preview
    const [previewUrl, setPreviewUrl] = useState<string>(imageUrl);
    const [currentBlob, setCurrentBlob] = useState<Blob>(imageBlob);

    // Load original dimensions
    useEffect(() => {
        if (isOpen && imageBlob) {
            getImageDimensions(imageBlob).then((dims) => {
                setOriginalDimensions(dims);
                setResizeWidth(dims.width);
                setResizeHeight(dims.height);
            });
            setPreviewUrl(imageUrl);
            setCurrentBlob(imageBlob);
            setRotation(0);
        }
    }, [isOpen, imageBlob, imageUrl]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    // Update height when width changes (maintain aspect ratio)
    const handleWidthChange = useCallback((newWidth: number) => {
        setResizeWidth(newWidth);
        if (maintainAspect && originalDimensions) {
            const aspectRatio = originalDimensions.width / originalDimensions.height;
            setResizeHeight(Math.round(newWidth / aspectRatio));
        }
    }, [maintainAspect, originalDimensions]);

    // Update width when height changes (maintain aspect ratio)
    const handleHeightChange = useCallback((newHeight: number) => {
        setResizeHeight(newHeight);
        if (maintainAspect && originalDimensions) {
            const aspectRatio = originalDimensions.width / originalDimensions.height;
            setResizeWidth(Math.round(newHeight * aspectRatio));
        }
    }, [maintainAspect, originalDimensions]);

    // Apply resize
    const applyResize = async () => {
        if (!originalDimensions) return;
        setIsProcessing(true);
        try {
            const resized = await resizeImage(currentBlob, resizeWidth, resizeHeight, false);
            const newUrl = URL.createObjectURL(resized);
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(newUrl);
            setCurrentBlob(resized);

            const newDims = await getImageDimensions(resized);
            setOriginalDimensions(newDims);
            setResizeWidth(newDims.width);
            setResizeHeight(newDims.height);
        } finally {
            setIsProcessing(false);
        }
    };

    // Apply rotation
    const applyRotation = async (angle: 90 | 270) => {
        setIsProcessing(true);
        try {
            const rotated = await rotateImage(currentBlob, angle);
            const newUrl = URL.createObjectURL(rotated);
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(newUrl);
            setCurrentBlob(rotated);

            const newDims = await getImageDimensions(rotated);
            setOriginalDimensions(newDims);
            setResizeWidth(newDims.width);
            setResizeHeight(newDims.height);

            setRotation((prev) => ((prev + angle) % 360) as RotationAngle);
        } finally {
            setIsProcessing(false);
        }
    };

    // Save and close
    const handleSave = () => {
        onSave(currentBlob, previewUrl);
        onClose();
    };

    // Reset to original
    const handleReset = () => {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(imageUrl);
        setCurrentBlob(imageBlob);
        setRotation(0);
        if (originalDimensions) {
            getImageDimensions(imageBlob).then((dims) => {
                setOriginalDimensions(dims);
                setResizeWidth(dims.width);
                setResizeHeight(dims.height);
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Edit Image</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab("resize")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                            activeTab === "resize"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Maximize2 className="w-4 h-4" />
                        Resize
                    </button>
                    <button
                        onClick={() => setActiveTab("rotate")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                            activeTab === "rotate"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <RotateCw className="w-4 h-4" />
                        Rotate
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
                    {/* Preview */}
                    <div className="flex-1 p-4 flex items-center justify-center bg-slate-50 min-h-[200px]">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-sm"
                        />
                    </div>

                    {/* Controls */}
                    <div className="w-full sm:w-64 p-4 border-t sm:border-t-0 sm:border-l border-slate-100 bg-white">
                        {activeTab === "resize" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">
                                        Width (px)
                                    </label>
                                    <input
                                        type="number"
                                        value={resizeWidth}
                                        onChange={(e) => handleWidthChange(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">
                                        Height (px)
                                    </label>
                                    <input
                                        type="number"
                                        value={resizeHeight}
                                        onChange={(e) => handleHeightChange(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={maintainAspect}
                                        onChange={(e) => setMaintainAspect(e.target.checked)}
                                        className="rounded border-slate-300"
                                    />
                                    Maintain aspect ratio
                                </label>

                                {/* Preset sizes */}
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-slate-500 uppercase">Presets</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[25, 50, 75].map((percent) => (
                                            <button
                                                key={percent}
                                                onClick={() => {
                                                    if (originalDimensions) {
                                                        const newWidth = Math.round((originalDimensions.width * percent) / 100);
                                                        handleWidthChange(newWidth);
                                                    }
                                                }}
                                                className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                                            >
                                                {percent}%
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={applyResize}
                                    disabled={isProcessing}
                                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isProcessing ? "Processing..." : "Apply Resize"}
                                </button>
                            </div>
                        )}

                        {activeTab === "rotate" && (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600">
                                    Rotate the image 90 degrees left or right.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => applyRotation(270)}
                                        disabled={isProcessing}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-200 disabled:opacity-50 transition-colors"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                        Left
                                    </button>
                                    <button
                                        onClick={() => applyRotation(90)}
                                        disabled={isProcessing}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-200 disabled:opacity-50 transition-colors"
                                    >
                                        <RotateCw className="w-5 h-5" />
                                        Right
                                    </button>
                                </div>
                                {originalDimensions && (
                                    <p className="text-xs text-slate-400 text-center">
                                        Current: {originalDimensions.width} × {originalDimensions.height}px
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        Reset
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

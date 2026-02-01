"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, FileImage, Image as ImageIcon, Globe } from "lucide-react";
import { QualitySlider } from "./QualitySlider";

export type TargetFormat = "png" | "jpg" | "webp";

interface FormatSelectorProps {
    selectedFormat: TargetFormat;
    onSelect: (format: TargetFormat) => void;
    quality: number;
    onQualityChange: (quality: number) => void;
    totalFileSize?: number;
}

export function FormatSelector({ selectedFormat, onSelect, quality, onQualityChange, totalFileSize }: FormatSelectorProps) {
    const isLossyFormat = selectedFormat === "jpg" || selectedFormat === "webp";
    const formats: { id: TargetFormat; label: string; icon: React.ReactNode; description: string }[] = [
        {
            id: "png",
            label: "PNG",
            icon: <FileImage className="w-5 h-5 sm:w-4 sm:h-4" />,
            description: "Best for high quality & transparency",
        },
        {
            id: "jpg",
            label: "JPG",
            icon: <ImageIcon className="w-5 h-5 sm:w-4 sm:h-4" />,
            description: "Best for photos & small file size",
        },
        {
            id: "webp",
            label: "WebP",
            icon: <Globe className="w-5 h-5 sm:w-4 sm:h-4" />,
            description: "Best performance for web",
        },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-slate-600">
                    Output Format
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {formats.map((format) => (
                        <button
                            key={format.id}
                            onClick={() => onSelect(format.id)}
                            className={cn(
                                "relative flex flex-col items-center p-4 sm:p-3 border rounded-xl sm:rounded-lg transition-colors text-center active:scale-[0.98]",
                                selectedFormat === format.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-slate-200 bg-white hover:border-slate-300 active:bg-slate-50"
                            )}
                        >
                            <div className={cn(
                                "p-2.5 sm:p-2 rounded-xl sm:rounded-lg mb-2",
                                selectedFormat === format.id ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                            )}>
                                {format.icon}
                            </div>
                            <span className={cn(
                                "font-medium text-sm",
                                selectedFormat === format.id ? "text-blue-700" : "text-slate-700"
                            )}>
                                {format.label}
                            </span>
                            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                                {format.description}
                            </p>
                            {selectedFormat === format.id && (
                                <div className="absolute top-2 right-2 w-5 h-5 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 sm:w-2.5 sm:h-2.5 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Quality Slider - only for lossy formats */}
                {isLossyFormat && (
                    <div className="mt-4">
                        <QualitySlider
                            quality={quality}
                            onChange={onQualityChange}
                            estimatedOriginalSize={totalFileSize}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import React, { useMemo } from "react";
import { cn, formatFileSize } from "@/lib/utils";

interface QualitySliderProps {
    quality: number;
    onChange: (quality: number) => void;
    estimatedOriginalSize?: number;
    className?: string;
}

export function QualitySlider({ quality, onChange, estimatedOriginalSize, className }: QualitySliderProps) {
    const estimatedSize = useMemo(() => {
        if (!estimatedOriginalSize) return null;
        const ratio = 0.05 + (quality / 100) * 0.5 + Math.pow(quality / 100, 2) * 0.4;
        return Math.round(estimatedOriginalSize * ratio);
    }, [quality, estimatedOriginalSize]);

    return (
        <div className={cn("w-full space-y-3", className)}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Quality</span>
                <span className="text-sm font-medium text-slate-900">{quality}%</span>
            </div>

            {/* Slider - touch optimized */}
            <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer touch-pan-x
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-6
                    [&::-webkit-slider-thumb]:h-6
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-blue-600
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:active:scale-110
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-moz-range-thumb]:w-6
                    [&::-moz-range-thumb]:h-6
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-blue-600
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:shadow-md
                    [&::-moz-range-thumb]:cursor-pointer"
                style={{
                    background: `linear-gradient(to right, #2563eb ${quality}%, #e2e8f0 ${quality}%)`
                }}
            />

            {/* Preset buttons - touch optimized */}
            <div className="flex gap-2">
                {[75, 90, 100].map((preset) => (
                    <button
                        key={preset}
                        onClick={() => onChange(preset)}
                        className={cn(
                            "flex-1 py-2.5 sm:py-1.5 rounded-lg sm:rounded-md text-sm sm:text-xs font-medium transition-colors active:scale-[0.98]",
                            quality === preset
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-200"
                        )}
                    >
                        {preset}%
                    </button>
                ))}
            </div>

            {/* Estimated file size */}
            {estimatedSize && (
                <p className="text-xs text-slate-400 text-center">
                    Est. size: ~{formatFileSize(estimatedSize)}
                </p>
            )}
        </div>
    );
}

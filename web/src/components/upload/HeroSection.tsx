"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, ArrowRight, CheckCircle2 } from "lucide-react";
import { TargetFormat } from "./FormatSelector";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
    targetFormat: TargetFormat;
    onTargetFormatChange: (format: TargetFormat) => void;
    inputFormat: string;
    onInputFormatChange: (format: string) => void;
}

export function HeroSection({
    targetFormat,
    onTargetFormatChange,
    inputFormat,
    onInputFormatChange
}: HeroSectionProps) {
    const [isOutputDropdownOpen, setIsOutputDropdownOpen] = useState(false);
    const [isInputDropdownOpen, setIsInputDropdownOpen] = useState(false);
    const outputDropdownRef = useRef<HTMLDivElement>(null);
    const inputDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (outputDropdownRef.current && !outputDropdownRef.current.contains(event.target as Node)) {
                setIsOutputDropdownOpen(false);
            }
            if (inputDropdownRef.current && !inputDropdownRef.current.contains(event.target as Node)) {
                setIsInputDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formats: { id: TargetFormat; label: string }[] = [
        { id: "png", label: "PNG" },
        { id: "jpg", label: "JPG" },
        { id: "webp", label: "WEBP" },
    ];

    // Identical list for input formats for now
    const inputFormats = [
        { id: "heic", label: "HEIC" },
        { id: "jpg", label: "JPG" },
        { id: "png", label: "PNG" },
        { id: "webp", label: "WEBP" },
    ];

    const handleOutputSelect = (format: TargetFormat) => {
        onTargetFormatChange(format);
        setIsOutputDropdownOpen(false);
    };

    const handleInputSelect = (format: string) => {
        onInputFormatChange(format);
        setIsInputDropdownOpen(false);
    };

    return (
        <header className="w-full max-w-4xl mx-auto text-center space-y-8 pt-8 pb-12">

            {/* Main Title Area */}
            <div className="flex flex-col items-center justify-center gap-6">

                {/* Format Transition Row with H1 for SEO */}
                <h1 className="flex items-center gap-2 sm:gap-4 text-2xl sm:text-5xl font-black text-slate-900 tracking-tight flex-wrap justify-center">

                    {/* Input Format Dropdown */}
                    <div className="relative inline-block" ref={inputDropdownRef}>
                        <button
                            onClick={() => setIsInputDropdownOpen(!isInputDropdownOpen)}
                            className="flex items-center gap-2 border-b-4 border-blue-600 hover:text-blue-600 hover:border-blue-700 transition-colors pb-1"
                        >
                            {inputFormat.toUpperCase()}
                            <ChevronDown className="w-5 h-5 sm:w-8 sm:h-8 stroke-[3]" />
                        </button>

                        {/* Input Dropdown Menu */}
                        {isInputDropdownOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[90vw] max-w-[320px] bg-white rounded-3xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="grid grid-cols-2 gap-2">
                                    {inputFormats.map((format) => (
                                        <button
                                            key={format.id}
                                            onClick={() => handleInputSelect(format.id)}
                                            className={cn(
                                                "py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all",
                                                inputFormat === format.id
                                                    ? "border-blue-500 text-blue-600 bg-blue-50"
                                                    : "border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                            )}
                                        >
                                            {format.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <span className="text-slate-300">to</span>

                    {/* Output Format Dropdown */}
                    <div className="relative inline-block" ref={outputDropdownRef}>
                        <button
                            onClick={() => setIsOutputDropdownOpen(!isOutputDropdownOpen)}
                            className="flex items-center gap-2 border-b-4 border-blue-600 hover:text-blue-600 hover:border-blue-700 transition-colors pb-1"
                        >
                            {targetFormat.toUpperCase()}
                            <ChevronDown className="w-5 h-5 sm:w-8 sm:h-8 stroke-[3]" />
                        </button>

                        {/* Output Dropdown Menu */}
                        {isOutputDropdownOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[90vw] max-w-[320px] bg-white rounded-3xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="grid grid-cols-3 gap-2">
                                    {formats.map((format) => (
                                        <button
                                            key={format.id}
                                            onClick={() => handleOutputSelect(format.id)}
                                            className={cn(
                                                "py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all",
                                                targetFormat === format.id
                                                    ? "border-blue-500 text-blue-600 bg-blue-50"
                                                    : "border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                            )}
                                        >
                                            {format.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </h1>

                <div className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl px-4">
                    Convert {inputFormat.toUpperCase()} to {targetFormat.toUpperCase()} online for free. Drag and drop your images below to convert them instantly.
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-6 text-sm font-bold text-slate-700 flex-wrap justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
                            <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        Free Converter
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
                            <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        No Ads
                    </div>
                </div>

            </div>
        </header>
    );
}

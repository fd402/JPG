import { Metadata } from "next";
import MainConverter from "@/components/MainConverter";
import { notFound } from "next/navigation";
import { TargetFormat } from "@/components/upload/FormatSelector";

// Valid formats
const VALID_SOURCES = ['heic', 'webp', 'png', 'jpg', 'jpeg'];
const VALID_TARGETS = ['jpg', 'png', 'webp'];

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

function parseSlug(slug: string): { source: string; target: string } | null {
    // Expected format: source-to-target (e.g., heic-to-jpg)
    const parts = slug.split('-to-');

    if (parts.length !== 2) {
        return null;
    }

    const source = parts[0].toLowerCase();
    const target = parts[1].toLowerCase();

    return { source, target };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const parsed = parseSlug(slug);

    if (!parsed) {
        return {};
    }

    const { source, target } = parsed;
    const sourceFormat = source.toUpperCase();
    const targetFormat = target.toUpperCase();

    return {
        title: `Convert ${sourceFormat} to ${targetFormat} Free - PicSwitch`,
        description: `Convert ${sourceFormat} images to ${targetFormat} instantly in your browser. Fast, private, and free. No uploads required.`,
        alternates: {
            canonical: `https://picswitch.org/${slug}`,
        },
        openGraph: {
            title: `Convert ${sourceFormat} to ${targetFormat} Instantly`,
            description: `Free online ${sourceFormat} to ${targetFormat} converter. Fast, private, and no uploads.`,
        },
    };
}

export default async function DynamicConverter({ params }: Props) {
    const { slug } = await params;
    const parsed = parseSlug(slug);

    if (!parsed) {
        notFound();
    }

    const { source, target } = parsed;

    // Validate formats
    if (!VALID_SOURCES.includes(source) || !VALID_TARGETS.includes(target)) {
        notFound();
    }

    // Prevent same-format conversion (e.g. jpg-to-jpg)
    if (source === target) {
        notFound();
    }

    const sourceFormat = source.toUpperCase();
    const targetFormat = target.toUpperCase();

    return (
        <MainConverter
            initialTargetFormat={target as TargetFormat}
            headline={
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900">
                    Convert {sourceFormat} to {targetFormat} <br />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Instantly</span>
                </h1>
            }
            subheadline={`Fast, private, and free ${sourceFormat} to ${targetFormat} converter. Works directly in your browser.`}
        />
    );
}

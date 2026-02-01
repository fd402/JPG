"use client";

import { useEffect, useRef, useState } from "react";
import "./AdBanner.css";

const ADSENSE_CLIENT = "ca-pub-6101504508825022";

// Ad slot IDs from AdSense
const AD_SLOTS = {
    header: "6936461205",
    footer: "6685614539",
};

interface AdBannerProps {
    position: "header" | "footer";
}

/**
 * AdBanner component that displays Google AdSense ads.
 * Google's built-in CMP handles GDPR consent automatically.
 */
export function AdBanner({ position }: AdBannerProps) {
    const [isClient, setIsClient] = useState(false);
    const adRef = useRef<HTMLModElement>(null);
    const adInitialized = useRef(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Initialize AdSense when component mounts
    useEffect(() => {
        if (isClient && adRef.current && !adInitialized.current) {
            try {
                const timer = setTimeout(() => {
                    if (typeof window !== "undefined" && adRef.current) {
                        // @ts-expect-error - adsbygoogle is added by external script
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                        adInitialized.current = true;
                    }
                }, 100);
                return () => clearTimeout(timer);
            } catch (e) {
                console.warn("AdSense initialization failed:", e);
            }
        }
    }, [isClient]);

    if (!isClient) {
        return null;
    }

    const adSlot = AD_SLOTS[position];

    return (
        <div className={`ad-banner ad-banner--${position}`}>
            <div className="ad-banner__container">
                <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client={ADSENSE_CLIENT}
                    data-ad-slot={adSlot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>
        </div>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import "./AdBanner.css";

const ADSENSE_CLIENT = "ca-pub-6101504508825022";

// Ad slot IDs from AdSense
const AD_SLOTS = {
    header: "6936461205",
    footer: "6685614539",
    left: "6936461205",   // Can use same slot or create new one in AdSense
    right: "6685614539",  // Can use same slot or create new one in AdSense
};

interface AdBannerProps {
    position: "header" | "footer" | "left" | "right";
}

/**
 * AdBanner component that displays Google AdSense ads.
 * Supports responsive layouts - sidebars on desktop, header/footer on mobile.
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
    const isSidebar = position === "left" || position === "right";

    return (
        <div className={`ad-banner ad-banner--${position} ${isSidebar ? 'ad-banner--sidebar' : ''}`}>
            <div className="ad-banner__container">
                <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client={ADSENSE_CLIENT}
                    data-ad-slot={adSlot}
                    data-ad-format={isSidebar ? "vertical" : "auto"}
                    data-full-width-responsive={!isSidebar}
                />
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { canShowAds } from "@/lib/cookieConsent";
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
 * Only shows ads if user has consented to marketing cookies.
 */
export function AdBanner({ position }: AdBannerProps) {
    const [showAd, setShowAd] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const adRef = useRef<HTMLModElement>(null);
    const adInitialized = useRef(false);

    useEffect(() => {
        setIsClient(true);
        setShowAd(canShowAds());

        // Listen for consent changes
        const handleConsentUpdate = () => {
            setShowAd(canShowAds());
        };

        window.addEventListener("cookie-consent-updated", handleConsentUpdate);
        return () => {
            window.removeEventListener("cookie-consent-updated", handleConsentUpdate);
        };
    }, []);

    // Initialize AdSense when ad becomes visible
    useEffect(() => {
        if (showAd && adRef.current && !adInitialized.current) {
            try {
                // Small delay to ensure AdSense script is loaded
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
    }, [showAd]);

    // Don't render on server or if user hasn't consented
    if (!isClient || !showAd) {
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

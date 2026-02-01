"use client";

import { useEffect, useState } from "react";
import { canShowAds } from "@/lib/cookieConsent";

const ADSENSE_CLIENT = "ca-pub-6101504508825022";

/**
 * Dynamically loads the AdSense script only when user has consented to marketing cookies.
 * This component should be placed in the layout.
 */
export function AdSenseLoader() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadScript = () => {
            if (!canShowAds() || loaded) return;

            // Check if script already exists
            if (document.querySelector(`script[src*="adsbygoogle"]`)) {
                setLoaded(true);
                return;
            }

            const script = document.createElement("script");
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
            script.async = true;
            script.crossOrigin = "anonymous";
            script.onload = () => setLoaded(true);
            document.head.appendChild(script);
        };

        // Load on mount if consent already given
        loadScript();

        // Listen for consent updates
        const handleConsentUpdate = () => loadScript();
        window.addEventListener("cookie-consent-updated", handleConsentUpdate);

        return () => {
            window.removeEventListener("cookie-consent-updated", handleConsentUpdate);
        };
    }, [loaded]);

    return null; // This component doesn't render anything
}

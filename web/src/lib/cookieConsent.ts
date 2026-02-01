// Cookie consent types and utilities for GDPR compliance

export interface CookiePreferences {
    necessary: boolean;    // Always true - required for site operation
    analytics: boolean;    // Analytics/performance cookies
    marketing: boolean;    // Advertising/marketing cookies
    timestamp: number;     // When consent was given
}

const CONSENT_KEY = "cookie-consent";

/**
 * Get current cookie consent from localStorage
 */
export function getConsent(): CookiePreferences | null {
    if (typeof window === "undefined") return null;

    try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (!stored) return null;
        return JSON.parse(stored) as CookiePreferences;
    } catch {
        return null;
    }
}

/**
 * Save cookie consent to localStorage
 */
export function setConsent(preferences: Omit<CookiePreferences, "necessary" | "timestamp">): void {
    if (typeof window === "undefined") return;

    const consent: CookiePreferences = {
        necessary: true, // Always required
        analytics: preferences.analytics,
        marketing: preferences.marketing,
        timestamp: Date.now(),
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

    // Dispatch event for other components to react
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consent }));
}

/**
 * Accept all cookies
 */
export function acceptAll(): void {
    setConsent({ analytics: true, marketing: true });
}

/**
 * Accept only necessary cookies
 */
export function acceptNecessaryOnly(): void {
    setConsent({ analytics: false, marketing: false });
}

/**
 * Check if consent has been given (any type)
 */
export function hasConsent(): boolean {
    return getConsent() !== null;
}

/**
 * Check if marketing cookies are allowed (for ads)
 */
export function canShowAds(): boolean {
    const consent = getConsent();
    return consent?.marketing === true;
}

/**
 * Check if analytics are allowed
 */
export function canUseAnalytics(): boolean {
    const consent = getConsent();
    return consent?.analytics === true;
}

/**
 * Reset consent (for testing or user request)
 */
export function resetConsent(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new CustomEvent("cookie-consent-reset"));
}

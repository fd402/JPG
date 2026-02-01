"use client";

import { useEffect, useState } from "react";
import { hasConsent, acceptAll, acceptNecessaryOnly } from "@/lib/cookieConsent";
import "./CookieConsent.css";

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show if consent hasn't been given yet
        if (!hasConsent()) {
            setShowBanner(true);
            // Trigger animation after mount
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        }
    }, []);

    const handleAcceptAll = () => {
        acceptAll();
        setIsVisible(false);
        setTimeout(() => setShowBanner(false), 300);
    };

    const handleAcceptNecessary = () => {
        acceptNecessaryOnly();
        setIsVisible(false);
        setTimeout(() => setShowBanner(false), 300);
    };

    if (!showBanner) return null;

    return (
        <div className={`cookie-banner ${isVisible ? "cookie-banner--visible" : ""}`}>
            <div className="cookie-banner__content">
                <div className="cookie-banner__text">
                    <h3 className="cookie-banner__title">🍪 Cookie-Einstellungen</h3>
                    <p className="cookie-banner__description">
                        Wir verwenden Cookies, um die Nutzung unserer Website zu analysieren und
                        personalisierte Werbung anzuzeigen. Du kannst wählen, welche Cookies du akzeptierst.
                    </p>
                </div>
                <div className="cookie-banner__actions">
                    <button
                        onClick={handleAcceptNecessary}
                        className="cookie-banner__button cookie-banner__button--secondary"
                    >
                        Nur notwendige
                    </button>
                    <button
                        onClick={handleAcceptAll}
                        className="cookie-banner__button cookie-banner__button--primary"
                    >
                        Alle akzeptieren
                    </button>
                </div>
            </div>
        </div>
    );
}

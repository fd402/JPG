import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
                <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
                    ← Back to PicSwitch
                </Link>

                <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>

                <section className="space-y-6 text-slate-600 text-sm leading-relaxed">
                    <div>
                        <h2 className="font-semibold text-slate-800 text-base">1. Privacy at a Glance</h2>
                        <p className="mt-2">
                            This privacy policy explains the nature, scope, and purpose of the processing
                            of personal data within our online offering.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800 text-base">2. Data Controller</h2>
                        <p className="mt-2">
                            Felix Vancek<br />
                            Erika-Kröger-Str. 60, 47198 Duisburg<br />
                            Email: fdvancek@gmail.com
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800 text-base">3. Data Processing on This Website</h2>

                        <h3 className="font-medium text-slate-700 mt-3">Local Processing</h3>
                        <p className="mt-1">
                            PicSwitch processes your images entirely locally in your browser.
                            <strong> No images are uploaded to our servers.</strong> The conversion
                            is performed client-side using JavaScript.
                        </p>

                        <h3 className="font-medium text-slate-700 mt-3">Cookies</h3>
                        <p className="mt-1">
                            We use cookies to store your consent for advertising purposes
                            (cookie consent). These cookies are technically necessary and are only
                            extended for advertising purposes with your consent.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800 text-base">4. Advertising (Google AdSense)</h2>
                        <p className="mt-2">
                            If you consent to the use of marketing cookies, ads from Google
                            AdSense will be displayed. Google may set cookies and process your IP address.
                            For more information, please refer to the{" "}
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Google Privacy Policy
                            </a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800 text-base">5. Your Rights</h2>
                        <p className="mt-2">
                            You have the right to access, rectification, deletion, and restriction of
                            the processing of your personal data. Please contact us by email for these matters.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800 text-base">6. Withdrawal of Consent</h2>
                        <p className="mt-2">
                            You can withdraw your cookie consent at any time by deleting the cookies
                            in your browser and reloading the page.
                        </p>
                    </div>
                </section>

                <div className="mt-8 pt-6 border-t text-center">
                    <Link href="/legal" className="text-blue-600 hover:underline text-sm">
                        Legal Notice →
                    </Link>
                </div>
            </div>
        </div>
    );
}

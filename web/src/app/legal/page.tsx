import Link from "next/link";

export default function LegalNotice() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
                <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
                    ← Back to PicSwitch
                </Link>

                <h1 className="text-3xl font-bold text-slate-900 mb-6">Legal Notice</h1>

                <section className="space-y-4 text-slate-600">
                    <div>
                        <h2 className="font-semibold text-slate-800">Information according to § 5 TMG</h2>
                        <p className="mt-2">
                            Felix Vancek<br />
                            Erika-Kröger-Str. 60<br />
                            47198 Duisburg<br />
                            Germany
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800">Contact</h2>
                        <p className="mt-2">
                            Email: fdvancek@gmail.com
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800">Responsible for content according to § 55 Abs. 2 RStV</h2>
                        <p className="mt-2">
                            Felix Vancek<br />
                            Erika-Kröger-Str. 60, 47198 Duisburg
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800">Disclaimer</h2>
                        <h3 className="font-medium text-slate-700 mt-3">Liability for Content</h3>
                        <p className="mt-1 text-sm">
                            The contents of our pages have been created with the utmost care. However, we cannot
                            guarantee the accuracy, completeness, or timeliness of the content.
                        </p>

                        <h3 className="font-medium text-slate-700 mt-3">Liability for Links</h3>
                        <p className="mt-1 text-sm">
                            Our website contains links to external third-party websites over whose content we have
                            no influence. The respective provider or operator is always responsible for the content
                            of the linked pages.
                        </p>
                    </div>
                </section>

                <div className="mt-8 pt-6 border-t text-center">
                    <Link href="/privacy" className="text-blue-600 hover:underline text-sm">
                        Privacy Policy →
                    </Link>
                </div>
            </div>
        </div>
    );
}

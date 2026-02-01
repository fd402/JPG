import Link from "next/link";

export default function Datenschutz() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
                <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
                    ← Zurück zu PicSwitch
                </Link>

                <h1 className="text-3xl font-bold text-slate-900 mb-6">Datenschutzerklärung</h1>

                <section className="space-y-6 text-slate-600 text-sm leading-relaxed">
                    <div>
                        <h2 className="font-semibold text-slate-800 text-base">1. Datenschutz auf einen Blick</h2>
                        <p className="mt-2">
                            Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung
                            von personenbezogenen Daten innerhalb unseres Onlineangebotes auf.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800 text-base">2. Verantwortlicher</h2>
                        <p className="mt-2">
                            Felix Vancek<br />
                            [Adresse]<br />
                            E-Mail: [deine-email@beispiel.de]
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800 text-base">3. Datenverarbeitung auf dieser Website</h2>

                        <h3 className="font-medium text-slate-700 mt-3">Lokale Verarbeitung</h3>
                        <p className="mt-1">
                            PicSwitch verarbeitet Ihre Bilder vollständig lokal in Ihrem Browser.
                            <strong> Keine Bilder werden auf unsere Server hochgeladen.</strong> Die Konvertierung
                            erfolgt clientseitig mittels JavaScript.
                        </p>

                        <h3 className="font-medium text-slate-700 mt-3">Cookies</h3>
                        <p className="mt-1">
                            Wir verwenden Cookies, um Ihre Einwilligung zur Verwendung von Werbung zu speichern
                            (Cookie-Consent). Diese Cookies sind technisch notwendig und werden nur mit Ihrer
                            Zustimmung für Werbezwecke erweitert.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800 text-base">4. Werbung (Google AdSense)</h2>
                        <p className="mt-2">
                            Wenn Sie der Verwendung von Marketing-Cookies zustimmen, werden Anzeigen von Google
                            AdSense eingeblendet. Google kann dabei Cookies setzen und Ihre IP-Adresse verarbeiten.
                            Weitere Informationen finden Sie in der{" "}
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Datenschutzerklärung von Google
                            </a>.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800 text-base">5. Ihre Rechte</h2>
                        <p className="mt-2">
                            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
                            Verarbeitung Ihrer personenbezogenen Daten. Kontaktieren Sie uns hierzu per E-Mail.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800 text-base">6. Widerruf Ihrer Einwilligung</h2>
                        <p className="mt-2">
                            Sie können Ihre Cookie-Einwilligung jederzeit widerrufen, indem Sie die Cookies
                            in Ihrem Browser löschen und die Seite neu laden.
                        </p>
                    </div>
                </section>

                <div className="mt-8 pt-6 border-t text-center">
                    <Link href="/impressum" className="text-blue-600 hover:underline text-sm">
                        Impressum →
                    </Link>
                </div>
            </div>
        </div>
    );
}

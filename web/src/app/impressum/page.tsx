import Link from "next/link";

export default function Impressum() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
                <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
                    ← Zurück zu PicSwitch
                </Link>

                <h1 className="text-3xl font-bold text-slate-900 mb-6">Impressum</h1>

                <section className="space-y-4 text-slate-600">
                    <div>
                        <h2 className="font-semibold text-slate-800">Angaben gemäß § 5 TMG</h2>
                        <p className="mt-2">
                            Felix Vancek<br />
                            [Straße und Hausnummer]<br />
                            [PLZ Ort]<br />
                            Deutschland
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800">Kontakt</h2>
                        <p className="mt-2">
                            E-Mail: [deine-email@beispiel.de]
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                        <p className="mt-2">
                            Felix Vancek<br />
                            [Adresse wie oben]
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-800">Haftungsausschluss</h2>
                        <h3 className="font-medium text-slate-700 mt-3">Haftung für Inhalte</h3>
                        <p className="mt-1 text-sm">
                            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
                            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                        </p>

                        <h3 className="font-medium text-slate-700 mt-3">Haftung für Links</h3>
                        <p className="mt-1 text-sm">
                            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir
                            keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
                            Anbieter oder Betreiber der Seiten verantwortlich.
                        </p>
                    </div>
                </section>

                <div className="mt-8 pt-6 border-t text-center">
                    <Link href="/datenschutz" className="text-blue-600 hover:underline text-sm">
                        Datenschutzerklärung →
                    </Link>
                </div>
            </div>
        </div>
    );
}

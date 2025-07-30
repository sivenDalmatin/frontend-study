import React, { useState } from 'react'

export default function UserInfoForm({ onSubmit }) {
    const [age, setAge] = useState('')
    const [field, setField] = useState('')
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
    const [showPrivacy, setShowPrivacy] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        const parsedAge = parseInt(age)

        if (!acceptedPrivacy) {
            alert("Bitte akzeptiere die Datenschutzerklärung.")
            return
        }

        console.log(`${import.meta.env.VITE_BACKEND_URL}/register-user`)

        if (parsedAge >= 18 && field) {
            const id = Math.random().toFixed(3).toString().slice(2)
            onSubmit({ age, field, id })
        } else {
            alert("Du musst mindestens 18 Jahre alt sein, um teilzunehmen.")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4 text-center">
            <h2 className="text-xl font-semibold">Bitte gib Deine Hintergrundinformationen ein</h2>

            <input
                type="number"
                placeholder="Alter"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full border p-2 rounded"
                required
            />

            <select
                value={field}
                onChange={e => setField(e.target.value)}
                className="w-full border p-2 rounded"
                required
            >
                <option value="" disabled>Wähle Dein Studienfeld</option>
                <option value="psychology">Psychologie-nah</option>
                <option value="medicine">Medizin-nah</option>
                <option value="other">Andere</option>
            </select>

            <div className="text-left flex items-start gap-2">
                <input
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={e => setAcceptedPrivacy(e.target.checked)}
                />
                <label className="text-sm">
                    Ich habe die{' '}
                    <button
                        type="button"
                        className="text-blue-600 underline"
                        onClick={() => setShowPrivacy(true)}
                    >
                        Datenschutzerklärung
                    </button>{' '}
                    gelesen und akzeptiere sie.
                </label>
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Weiter
            </button>

            {/* ✅ Datenschutz Modal */}
            {showPrivacy && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 max-w-lg w-full rounded relative">
                        <button
                            onClick={() => setShowPrivacy(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black"
                        >
                            ✖
                        </button>
                        <h3 className="text-xl font-bold mb-2">Datenschutzerklärung</h3>
                        <div className="text-sm space-y-2 max-h-[60vh] overflow-y-auto text-left">
                            <p>
                                Die Teilnahme an dieser Studie ist freiwillig. Es werden keinerlei personenbezogene Daten erhoben, mit Ausnahme von Alter und Studienfach. Alle Gesprächsdaten werden anonymisiert gespeichert und ausschließlich zu wissenschaftlichen Zwecken verwendet.
                            </p>
                            <p>
                                Die Daten werden lokal auf Servern gespeichert und nicht an Dritte weitergegeben. Du kannst die Teilnahme jederzeit abbrechen. Durch das Fortfahren bestätigst Du, dass Du mindestens 18 Jahre alt bist und die Datenschutzerklärung gelesen hast.
                            </p>
                            <h1>Datenschutzerklärung für die Teilnahme an der Online-Studie</h1>

                            <p>Im Rahmen einer Bachelorarbeit an der Universität Münster wird eine Online-Studie durchgeführt. Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen. Nachfolgend informieren wir Sie über Art, Umfang und Zweck der Erhebung und Verarbeitung Ihrer Daten.</p>

                            <h2>1. Verantwortliche Stelle</h2>
                            <p>Verantwortlich für die Erhebung und Verarbeitung der Daten ist:</p>
                            <p>Finn Geßner, Uni Münster</p>
                            <p>E-Mail: <a href="mailto:finn.gessner@uni-muenster.de">finn.gessner@uni-muenster.de</a></p>


                            <h2>2. Zweck der Datenerhebung</h2>
                            <p>Die Erhebung dient ausschließlich wissenschaftlichen Zwecken im Rahmen der Bachelorarbeit. Ziel ist die Auswertung bestimmter Fragestellungen im Studienkontext.</p>

                            <h2>3. Umfang der erhobenen Daten</h2>
                            <p>Im Rahmen der Studie werden lediglich folgende Angaben erhoben:</p>
                            <ul>
                                <li>Alter (in Jahren)</li>
                                <li>Studiengang</li>
                            </ul>
                            <p>Es werden keine Namen, E-Mail-Adressen oder sonstige direkt personenbezogenen Daten erfasst.</p>

                            <h2>4. Freiwilligkeit und Anonymität</h2>
                            <p>Die Teilnahme an der Studie ist freiwillig. Alle Angaben erfolgen anonym. Ein Rückschluss auf Ihre Person ist zu keinem Zeitpunkt möglich.</p>

                            <h2>5. Speicherung und Löschung der Daten</h2>
                            <p>Die erhobenen Daten werden ausschließlich für die Auswertung der Bachelorarbeit verwendet. Nach Abschluss der Auswertung werden die Daten gelöscht bzw. vollständig anonym archiviert, sodass kein Personenbezug möglich ist.</p>

                            <h2>6. Ihre Rechte</h2>
                            <p>Da keine personenbezogenen Daten im Sinne der DSGVO erhoben werden, entfallen bestimmte Rechte wie Auskunft oder Löschung. Sollten dennoch Fragen bestehen, können Sie sich gerne an die Studienleitung wenden.</p>

                            <p>Mit der Teilnahme an der Studie erklären Sie sich mit der beschriebenen Datennutzung einverstanden.</p>


                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}

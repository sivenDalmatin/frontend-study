import React, { useState } from 'react'

export default function UserInfoForm({ onSubmit }) {
    const [age, setAge] = useState('')
    const [field, setField] = useState('')
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
    const [showPrivacy, setShowPrivacy] = useState(false)
    const [showConsent, setShowConsent] = useState(false)
    const [showSoR, setShowSoR] = useState(false)
    const [acceptedConsent, setAcceptedConsent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault()
        const parsedAge = parseInt(age)

        if (!acceptedPrivacy || !acceptedConsent) {
            alert("Bitte akzeptiere die Datenschutzerklärung und die Einverständniserklärung.")
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
                    und
                    <button
                        type="button"
                        className="text-blue-600 underline"
                        onClick={() => setShowSoR(true)}
                    >
                        Stellungnahme des Forschers
                    </button>{' '}
                    gelesen und akzeptiere sie.
                </label>
            </div>

            <div className="text-left flex items-start gap-2">
                <input
                    type="checkbox"
                    checked={acceptedConsent}
                    onChange={e => setAcceptedConsent(e.target.checked)}
                />
                <label className="text-sm">
                    Ich habe die{' '}
                    <button
                        type="button"
                        className="text-blue-600 underline"
                        onClick={() => setShowConsent(true)}
                    >
                        Einverständniserklärung
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
                        <h1 className="text-xl font-bold mb-2">Data protection policy in accordance with Art. 13 GDPR and consent form</h1>
                        <div className="text-sm space-y-2 max-h-[60vh] overflow-y-auto text-left">
                            <h2>Project/reason: Studie zum Einsatz von KI als Patientensimulation</h2>
                            <h3>1. Name and address of the responsible controller</h3>
                            <p>The responsible controller as defined in the EU General Data Protection Regulation (GDPR)
                                and other national data protection laws of the EU member states as well as other data
                                protection-related provisions is:
                                Universität Münster / University of Münster represented by its Rector Schlossplatz 2, 48149
                                Münster, Germany
                                tel.: + 49 251 83-0
                                email: mailbox@uni-muenster.de
                                If you have any questions about the project, please contact the responsible staff member:
                                Finn Ole Geßner [finn.gessner@uni-muenster.de] (BSc student of Geoinformatics)</p>
                            <h3>2. Contact data of the Data Protection Officer</h3>
                            <p>You can contact the Data Protection Officer at:
                                Data Protection Office
                                Schlossplatz 2, 48149 Münster
                                tel.: + 49 251 83-22446
                                email: datenschutz@uni-muenster.de</p>
                            <h3>3. Data processing in connection with Studie zum Einsatz von KI als
                                Patientensimulation</h3>
                            <p>Diese Studie soll evaluieren, wie gut KI-Chatbots zur Patientensimulation und zum
                                Kommunikationstraining für Medizinstudenten geeignet ist. Im Vordergrund steht dabei die
                                Persönlichkeit des Chatbots. Die Diversität, Realismus und charakterliche Entwicklung</p>
                            <h4>a: Scope of data processing</h4>
                            <p>The following personal data is processed in connection with Studie zum Einsatz von KI als
                                Patientensimulation:
                                (1) age
                                (2) course of study</p>
                            <h4>b: Purposes of data processing</h4>
                            <p>The personal data listed above is processed for the purpose of carrying out the project
                                Studie zum Einsatz von KI als Patientensimulation.
                                The personal data listed above will be used to draw scientific conclusions about groups, not
                                about individual participants. Anonymised data might be published in academic journals,
                                presentations, open science data repositories, or other media, but not in a way that would
                                allow individual identification. One week after the completion of the study it might no longer
                                be possible to retract your data from such aggregated analyses.</p>
                            <h4>c: Legal basis for processing personal data</h4>
                            <p>Your consent serves as the legal basis for processing your personal data listed above by the
                                University of Münster, as stipulated by Art. 6 (1, 1a) GDPR and, if applicable, Art. 9 (2a)
                                GDPR.</p>
                            <h4>d: Further recipients of your personal data</h4>
                            <p>Your personal data will neither be shared with other recipients within the University of
                                Münster nor with recipients outside the University.</p>
                            <h4>e: Duration of storage of personal data</h4>
                            <p>The personal data listed above is stored for as long as necessary for carrying out the project
                                Studie zum Einsatz von KI als Patientensimulation. Upon
                                withdrawing your consent, we shall delete your personal data.</p>
                            <h3>4. Your rights as a data subject</h3>
                            <p>You have the right to information about your personal data processed by the University of
                                Münster (Art. 15 GDPR), the right to rectification (Art. 16 GDPR), erasure (Art. 17 GDPR),
                                restriction of processing (Art. 18 GDPR) and the right to withdraw prior consent to such
                                processing (Art. 7 (3) GDPR).
                                You may withdraw your consent in writing or by email from the contact persons listed under
                                nos. 1 and 2 (see above) of this data protection statement.
                                You also have the right to lodge a complaint with the supervisory authority. The responsible
                                supervisory authority is the Landesbeauftragte für Datenschutz und Informationsfreiheit
                                Nordrhein-Westfalen, Postfach 20 04 44, 40102 Düsseldorf, tel: +49 211 / 38424-0, email:
                                poststelle@ldi.nrw.de</p>
                            <h1>Declaration of consent</h1>
                            <p>With your consent, you grant permission to the University of Münster to collect and
                                process the personal data listed above under (3a) for the purposes indicated in (3b).
                                You have the right to withdraw your consent from the responsible party at any time. The
                                legality of all data processing from the time of consent until withdrawal of consent remains
                                unaffected.
                                With your signature, you indicate confirmation of the following:
                                “I have read the data protection statement for the project Studie zum Einsatz von KI als
                                Patientensimulation. I hereby voluntarily consent to having my personal data collected and
                                processed. I have been informed of the scope and purpose of data collection and
                                processing, as well as the right to withdraw consent. </p>
                        </div>

                    </div>
                </div>
            )}
            {showPrivacy && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 max-w-lg w-full rounded relative">
                        <button
                            onClick={() => setShowPrivacy(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black"
                        >
                            ✖
                        </button>
                        <h1 className="text-xl font-bold mb-2">Statement of the researcher</h1>
                        <div className="text-sm space-y-2 max-h-[60vh] overflow-y-auto text-left">
                            <h2>The author hereby states to comply with the 7 rules stated here:</h2>
                            <p>This procedure, including the Ethics-App is intended only as a guideline to research-active
                                students and employees of the Institute supervising the research. The responsibility for the
                                wellbeing of research participants lies on the side of the researcher. Any uncertainties must
                                be discussed with the Ethics Committee. Research approval is granted conditional to the
                                following provisions:</p><br />
                            <p>1. Before the study begins, you are obliged to present the Participant with an Informed
                                Consent Form (a template is automatically generated based on the data supplied to the
                                Ethics-App).</p><br />
                            <p>2. You are obliged to allow the participant to quit the study at any point with no further
                                consequences. If applicable, payment is still due if the participant decides to withdraw his or
                                her data at the end of the study (i.e. during the de-briefing phase).</p><br />
                            <p>3. You are obliged to follow the Institute procedure with regard to the handling of sensitive
                                private data.</p><br />
                            <p>4. If the study involves collection of information without obtaining prior consent from some
                                participants (e.g. public observation of human behaviour) information allowing the
                                researcher to potentially identify or harm the person cannot be collected (e.g. many big
                                data studies, street surveys). Observations and recordings of public behaviour
                                without consent can only occur if people can be reasonably expected to be
                                observed by strangers at the given place and time (with respect to the local cultural
                                norms).</p><br />
                            <p>5. People have the right to know who is observing them in non-public situations (such as a
                                meeting room, a laboratory). This right must be respected.</p><br />
                            <p>6. If your study involves your own students, declining participation cannot be linked
                                (formally or informally) to the course grading scheme. If participation in the study is
                                rewarded with credit points, alternative means of obtaining the same number of points at
                                the comparable time expense and effort must be made available.</p><br />
                            <p>7. I confirm I will provide de-briefing information based on the below form either verbally or
                                in written form to all participants of the study.</p>
                        </div>
                    </div>

                </div>)}


            {showConsent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 max-w-lg w-full rounded relative">
                        <button
                            onClick={() => setShowConsent(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black"
                        >
                            ✖
                        </button>
                        <h1 className="text-xl font-bold mb-2">Einverständniserklärung</h1>
                        <div className="text-sm max-h-[60vh] overflow-y-auto text-left">
                            {/* Deine Einverständniserklärung hier einfügen */}
                            <h2>Studientitel: Studie zum Einsatz von KI als Patientensimulation</h2>
                            <p>Liebe/r Teilnehmer/in,vielen Dank für Ihre Teilnahme an der Studie</p>
                            <h4>Forscher:</h4>
                            <p>Finn Ole Geßner [finn.gessner@uni-muenster.de] (BSc student of Geoinformatics)</p>
                            <h4>Zweck der Studie:</h4>
                            <p>Diese Studie soll evaluieren, wie gut KI-Chatbots zur Patientensimulation und zum
                                Kommunikationstraining für Medizinstudenten geeignet ist. Im Vordergrund steht dabei die
                                Persönlichkeit des Chatbots. Die Diversität, Realismus und charakterliche Entwicklung.</p>
                            <h4>Vorgehensweise:</h4>
                            <p>Die Studie ist in drei Teilen aufgebaut: 1. Interagieren mit den Chatbots. Die Teilnehmenden
                                sind dabei die Doktor:innen. Die Konversationen sollen möglichst realistisch sein 2.
                                Evaluation der vorangegangen Gespräche 3. Evaluation einiger andere Gespräche</p>
                            <h4>Dauer:</h4>
                            <p>30-45 Minuten</p>
                            <h4>Vergütung:</h4>
                            <p>Für Psychologiestudenten der Universität Münster wird es möglich sein sich VP Stunden anrechnen zu lassen.</p>
                            <br />
                            <p>Sie können zu jeder Zeit ohne Angabe von Gründen die Studie abbrechen und Ihre
                                Antworten zurückziehen. Dies hat keine weiteren Konsequenzen für Sie. Bei Fragen melden Sie sich beim Forscher.
                                Bei weiteren Fragen oder auch Beschwerden bitten wir Sie sich an die Ethik-Kommission des
                                Instituts zu wenden: [ifgi.ethics-app@uni-muenster.de].</p>
                            <br />
                            <p>Mit der Bestätigung durch das anhaken des Kästchens bestätige ich, dass...</p>
                            <br />
                            <p>... ich freiwillig an der Studie teilnehme</p>
                            <br />
                            <p>... ich Fragen stellen darf</p>
                            <br />
                            <p>... mir dieses Dokument vor der Studie gezeigt wurde.</p>
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}

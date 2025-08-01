import React, { useState, useEffect } from 'react'
import axios from 'axios'

function InfoPopup({ text }) {
    return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 p-2 text-xs bg-white border border-gray-300 rounded shadow z-20">
            {text}
        </div>
    )
}


export default function Classification({ userId }) {
    const [samples, setSamples] = useState([])
    const [index, setIndex] = useState(0)
    const [dominance, setDominance] = useState(2)
    const [friendliness, setFriendliness] = useState(2)
    const [submitted, setSubmitted] = useState(false)
    const [visibleDominance, setVisibleDominance] = useState(null)
    const [visibleFriendliness, setVisibleFriendliness] = useState(null)



    useEffect(() => {
        const fetchSentences = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/sentences`)
                setSamples(res.data)
            } catch (err) {
                console.error('Error loading sentences:', err)
            }
        }
        fetchSentences()
    }, [])

    const handleSubmit = async () => {
        const current = samples[index]
        const payload = {
            sentence: current.sentence,
            dominance,
            friendliness,
            classificator: userId
        }

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/classify`, payload)
            setSubmitted(true)
            setTimeout(() => {
                setDominance(2)
                setFriendliness(2)
                setIndex(index + 1)
                setSubmitted(false)
            }, 1000)
        } catch (err) {
            console.error('Error submitting classification:', err)
        }
    }

    if (samples.length === 0) {
        return <p>Loading sentences...</p>
    }

    if (index >= samples.length) {
        return (<div><p className="text-center text-green-600">Die Studie ist hiemit abgeschlossen 🎉</p> <p>Vielen Dank für die Teilnahme. Die Ihnen zugewiesene ID leutet: {userId}. Falls Sie im nachtrag die Daten löschen lassen möchten, schreiben Sie bitte eine Mail and finn.gessner@uni-muenster.de in der Sie auch Ihre ID nennen.</p></div>)
    }

    return (
        <div className="space-y-6">
            <div className="bg-yellow-100 border border-yellow-300 p-4 rounded text-sm text-gray-800">
                <h3>Bitte Klassifiziere jeden der 15 Konversationsausschnitte nach Freundlichkeit und Dominanz. Die Skalen sind angelehnt an das Interpersonal Circumplex Model. Falls du dies nicht kennst, orientiere dich an den zugehörigen Adjektiven</h3>
                <br />
                <h3 className="font-semibold mb-2">Skalen-Erklärung</h3>
                <p><strong>Freundlichkeit:</strong> Wie warm oder feindlich klingt die Aussage?</p>
                <ul className="list-disc ml-6 mb-2">
                    <li><em>1 = sehr freundlich</em> (unterstützend, empathisch)</li>
                    <li><em>3 = neutral</em></li>
                    <li><em>5 = sehr feindlich</em> (kalt, konfrontativ)</li>
                </ul>
                <p><strong>Dominanz:</strong> Wie durchsetzungsstark oder unterwürfig klingt die Aussage?</p>
                <ul className="list-disc ml-6">
                    <li><em>1 = sehr submissiv</em> (untergeordnet, zurückhaltend)</li>
                    <li><em>3 = neutral</em></li>
                    <li><em>5 = sehr dominant</em> (bestimmend, kontrollierend)</li>
                </ul>
            </div>

            <p className="text-lg font-medium">Satz {index + 1} von {samples.length}:</p>
            <blockquote className="p-4 bg-white shadow rounded italic">{samples[index].sentence}</blockquote>

            <div className="space-y-4">
                {/* Friendliness Scale */}
                <div className="w-full">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <p className="font-semibold text-center">Freundlichkeit</p>
                        <div
                            className="relative"
                            onMouseEnter={() => setVisibleFriendliness('f')}
                            onMouseLeave={() => setVisibleFriendliness(null)}
                        >
                            <span className="text-gray-500 cursor-pointer">❓</span>
                            {visibleFriendliness === 'f' && (
                                <InfoPopup text="Freundlichkeit beschreibt, wie warm, empathisch oder feindlich eine Aussage erscheint. Sehr freundlich = herzlich, sehr feindlich = konfrontativ." />
                            )}
                        </div>
                    </div>
                    <div className="relative w-full h-10 flex items-center justify-center">
                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 z-0" />
                        <div className="grid grid-cols-5 gap-0 w-full z-10">
                            {[0, 1, 2, 3, 4].map((val) => (
                                <label key={val} className="flex flex-col items-center">
                                    <input
                                        type="radio"
                                        name="friendliness"
                                        value={val}
                                        checked={friendliness === val}
                                        onChange={() => setFriendliness(val)}
                                        className="peer hidden"
                                    />
                                    <div className={`w-4 h-4 rounded-full border-2 ${friendliness === val ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`} />
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-5 text-xs text-center mt-1">
                        <span> <strong>Sehr freundlich:</strong> unterstützend, empathisch, herzlich</span>
                        <span> <strong>Etwas freundlich:</strong> wohlwollend, kooperativ</span>
                        <span><strong>Neutral:</strong> sachlich, emotionslos</span>
                        <span><strong>Etwas feindlich:</strong> distanziert, ablehnend</span>
                        <span><strong>Sehr feindlich:</strong> feindselig, konfrontativ, kalt</span>
                    </div>
                </div>


                {/* Dominance Scale */}
                <div className="w-full">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <p className="font-semibold text-center">Dominanz</p>
                        <div
                            className="relative"
                            onMouseEnter={() => setVisibleDominance('f')}
                            onMouseLeave={() => setVisibleDominance(null)}
                        >
                            <span className="text-gray-500 cursor-pointer">❓</span>
                            {visibleDominance === 'f' && (
                                <InfoPopup text="Dominanz beschreibt, wie stark eine Aussage als durchsetzungsfähig, kontrollierend oder unterwürfig erscheint. Sehr dominant = kontrollierend, sehr submissiv = zurückhaltend." />
                            )}
                        </div>
                    </div>
                    <div className="relative w-full h-10 flex items-center justify-center">
                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 z-0" />
                        <div className="grid grid-cols-5 gap-0 w-full z-10">
                            {[0, 1, 2, 3, 4].map((val) => (
                                <label key={val} className="flex flex-col items-center">
                                    <input
                                        type="radio"
                                        name="dominance"
                                        value={val}
                                        checked={friendliness === val}
                                        onChange={() => setDominance(val)}
                                        className="peer hidden"
                                    />
                                    <div className={`w-4 h-4 rounded-full border-2 ${dominance === val ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`} />
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-5 text-xs text-center mt-1">
                        <span> <strong>Sehr submissiv:</strong> unterwürfig, zurückhaltend, abhängig</span>
                        <span><strong>Etwas submissiv:</strong> vorsichtig, nachgiebig</span>
                        <span><strong>Neutral:</strong> weder dominant noch submissiv</span>
                        <span><strong>Etwas dominant:</strong> selbstbewusst, leitend</span>
                        <span><strong>Sehr dominant:</strong> kontrollierend, fordernd, bestimmend</span>
                    </div>
                </div>
            </div>


            <button
                onClick={handleSubmit}
                disabled={submitted}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
            >
                {submitted ? 'Gespeichert!' : 'Absenden'}
            </button>
        </div>
    )
}

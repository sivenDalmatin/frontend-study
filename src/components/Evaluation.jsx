// src/components/Evaluation.jsx

import React, { useState } from 'react'
import axios from 'axios'

function InfoPopup({ text }) {
    return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 p-2 text-xs bg-white border border-gray-300 rounded shadow z-20">
            {text}
        </div>
    )
}

function QuestionMark({ text }) {
    const [visible, setVisible] = useState(false)

    return (
        <div
            className="relative"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            <span className="text-gray-500 cursor-pointer">❓</span>
            {visible && <InfoPopup text={text} />}
        </div>
    )
}



export default function Evaluation({ dialogues, logFilenames, onNext, userId }) {
    const [ratings, setRatings] = useState(
        dialogues.map((dialogue) => ({
            realism: null,
            appropriateness: null,
            consistency: null,
            ipc_d_guess: null,
            ipc_f_guess: null,
            feedback: '',
            bot: dialogue.bot,
        }))
    )
    const [overallFeedback, setOverallFeedback] = useState({
        ranking: '',
        reason: '',
        diversity: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [visibleInfo, setVisibleInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false)


    const handleChange = (i, field, value) => {
        const updated = [...ratings]
        updated[i][field] = value
        setRatings(updated)
    }

    const allRatingsValid = ratings.every(rating => {
        const baseFieldsComplete =
            rating.realism !== null &&
            rating.appropriateness !== null &&
            rating.consistency !== null;

        const ipcFieldsComplete = rating.bot === 'gpt_default' ||
            (rating.ipc_d_guess !== null && rating.ipc_f_guess !== null);

        return baseFieldsComplete && ipcFieldsComplete;
    });

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            for (let i = 0; i < ratings.length; i++) {
                const entry = {
                    realism: parseInt(ratings[i].realism),
                    appropriateness: parseInt(ratings[i].appropriateness),
                    consistency: parseInt(ratings[i].consistency),
                    feedback: ratings[i].feedback.trim(),
                    log_filename: logFilenames[i],
                    ipc_d_guess: ratings[i].bot === 'gpt_default' ? null : parseInt(ratings[i].ipc_d_guess),
                    ipc_f_guess: ratings[i].bot === 'gpt_default' ? null : parseInt(ratings[i].ipc_f_guess),
                }
                console.log(entry)
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/evaluate`, entry)
            }

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/evaluate-summary`, {
                user_id: userId,
                ranking: overallFeedback.ranking,
                reason: overallFeedback.reason,
                diversity: parseInt(overallFeedback.diversity),
            })

            setSubmitted(true)
            if (onNext) {
                onNext()
            }
        } catch (err) {
            console.error('Error submitting evaluation:', err)
        } finally {
            setIsLoading(false)
        }
    }

    if (submitted) {
        return <p className="text-green-600 text-center">Danke für das Feedback der Dialoge</p>
    }

    return (
        <div className="space-y-8">
            <div className="bg-yellow-100 border border-yellow-300 p-4 rounded text-sm text-gray-800">
                <h3 className="font-semibold mb-2">Bewertungshinweise:</h3>
                <p>
                    <strong>Natürlichkeit / Glaubhaftigkeit:</strong> Fühlte sich der/die Patient:in glaubhaft und realistisch an?
                </p>
                <p>
                    <strong>Angemessenheit der Emotion:</strong> Waren die emotionalen Reaktionen angemessen und realistisch?
                </p>
                <p>
                    <strong>Kohärenz:</strong> War der Gesprächsverlauf schlüssig und zusammenhängend? Gab es ausbrüche aus der Rolle?
                </p>
                <p>
                    <strong>IPC-Profil (nur bei einigen Konversationen):</strong> Hier sollen das Dominanzlevel und Freundlichkeitslevel eingeordnet werden.
                </p>
            </div>

            {dialogues.map((dialogue, i) => (
                <div key={i} className="space-y-4 border rounded p-4">
                    <h4 className="font-bold">Dialog {i + 1}</h4>
                    <div className="space-y-1 text-sm">
                        {dialogue.turns.map((turn, j) => (
                            <p key={j}><strong>{turn.role === 'user' ? 'Du' : 'Patient'}:</strong> {turn.content}</p>
                        ))}
                    </div>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-6 mt-2">
                        <div className="flex flex-col gap-3 pt-2">
                            {/* Natürlichkeit / Glaubhaftigkeit */}
                            <div className="w-full">
                                <div className="flex items-center justify-center gap-2">
                                    <p className="font-semibold text-center">Glaubhaftigkeit / Natürlichkeit</p>
                                    <QuestionMark text="Bewertet, ob die Aussagen des Patienten realistisch und glaubwürdig wirken. Eine hohe Bewertung bedeutet, dass der Patient natürlich und überzeugend erscheint." />
                                </div>

                                <div className="relative w-full h-10 flex items-center justify-center">
                                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 z-0" />
                                    <div className="grid grid-cols-5 gap-0 w-full z-10">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <label key={val} className="flex flex-col items-center">
                                                <input
                                                    type="radio"
                                                    name={`realism_${i}`}
                                                    value={val}
                                                    checked={parseInt(ratings[i].realism) === val}
                                                    onChange={() => handleChange(i, 'realism', val.toString())}
                                                    className="peer hidden"
                                                />
                                                <div className={`w-4 h-4 rounded-full border-2 ${parseInt(ratings[i].realism) === val ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 text-xs text-center mt-1">
                                    <span>Unnatürlich</span>
                                    <span>Etwas unnatürlich</span>
                                    <span>Neutral</span>
                                    <span>Glaubhaft</span>
                                    <span>Sehr glaubhaft</span>
                                </div>
                            </div>

                            {/* Emotionale Angemessenheit */}
                            <div className="w-full mt-4">
                                <div className="flex items-center justify-center gap-2">
                                    <p className="font-semibold text-center">Emotionale Angemessenheit</p>
                                    <QuestionMark text="Bewertet, ob die emotionale Reaktion des Patienten zur Situation passt. Eine hohe Bewertung bedeutet, dass Emotionen passend und glaubhaft ausgedrückt wurden." />
                                </div>

                                <div className="relative w-full h-10 flex items-center justify-center">
                                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 z-0" />
                                    <div className="grid grid-cols-5 gap-0 w-full z-10">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <label key={val} className="flex flex-col items-center">
                                                <input
                                                    type="radio"
                                                    name={`appropriateness_${i}`}
                                                    value={val}
                                                    checked={parseInt(ratings[i].appropriateness) === val}
                                                    onChange={() => handleChange(i, 'appropriateness', val.toString())}
                                                    className="peer hidden"
                                                />
                                                <div className={`w-4 h-4 rounded-full border-2 ${parseInt(ratings[i].appropriateness) === val ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 text-xs text-center mt-1">
                                    <span>Unangemessen</span>
                                    <span>Etwas unangemessen</span>
                                    <span>Neutral</span>
                                    <span>Angemessen</span>
                                    <span>Sehr angemessen</span>
                                </div>
                            </div>

                            {/* Kohärenz */}
                            <div className="w-full mt-4"><div className="flex items-center justify-center gap-2">
                                <p className="font-semibold text-center">Kohärenz des Gesprächs</p>
                                <QuestionMark text="Bewertet, wie gut der Gesprächsverlauf zusammenhängt. Eine hohe Bewertung bedeutet, dass der Gesprächspartner konsistent bleibt und keine logischen Brüche zeigt." />
                            </div>
                                <div className="relative w-full h-10 flex items-center justify-center">
                                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 z-0" />
                                    <div className="grid grid-cols-5 gap-0 w-full z-10">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <label key={val} className="flex flex-col items-center">
                                                <input
                                                    type="radio"
                                                    name={`consistency_${i}`}
                                                    value={val}
                                                    checked={parseInt(ratings[i].consistency) === val}
                                                    onChange={() => handleChange(i, 'consistency', val.toString())}
                                                    className="peer hidden"
                                                />
                                                <div className={`w-4 h-4 rounded-full border-2 ${parseInt(ratings[i].consistency) === val ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 text-xs text-center mt-1">
                                    <span>Unlogisch</span>
                                    <span>Etwas unlogisch</span>
                                    <span>Neutral</span>
                                    <span>Kohärent</span>
                                    <span>Sehr kohärent</span>
                                </div>
                            </div>
                        </div>


                        <div className="bg-gray-100 p-3 rounded border border-gray-300 space-y-6 mt-2">
                            {ratings[i].bot !== 'gpt_default' && (

                                <div className="w-full mt-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <p className="font-semibold text-center">Einschätzung der Dominanz</p>
                                        <QuestionMark text="Dominanz beschreibt, wie stark eine Aussage als durchsetzungsfähig, kontrollierend oder unterwürfig erscheint. Sehr dominant = kontrollierend, sehr submissiv = zurückhaltend." />
                                    </div>
                                    <div className="relative w-full h-10 flex items-center justify-center">
                                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 z-0" />
                                        <div className="grid grid-cols-5 gap-0 w-full z-10">
                                            {[0, 1, 2, 3, 4].map((val) => (
                                                <label key={val} className="flex flex-col items-center">
                                                    <input
                                                        type="radio"
                                                        name={`ipc_d_guess_${i}`}
                                                        value={val}
                                                        checked={parseInt(ratings[i].ipc_d_guess) === val}
                                                        onChange={() => handleChange(i, 'ipc_d_guess', val.toString())}
                                                        className="peer hidden"
                                                    />
                                                    <div className={`w-4 h-4 rounded-full border-2 ${parseInt(ratings[i].ipc_d_guess) === val ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`} />
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
                            )}

                            {ratings[i].bot !== 'gpt_default' && (
                                <div className="w-full mt-6">
                                    <div className="flex items-center justify-center gap-2">
                                        <p className="font-semibold text-center">Einschätzung der Freundlichkeit</p>
                                        <QuestionMark text="Freundlichkeit beschreibt, wie warm, empathisch oder feindlich eine Aussage erscheint. Sehr freundlich = herzlich, sehr feindlich = konfrontativ." />
                                    </div>
                                    <div className="relative w-full h-10 flex items-center justify-center">
                                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 z-0" />
                                        <div className="grid grid-cols-5 gap-0 w-full z-10">
                                            {[0, 1, 2, 3, 4].map((val) => (
                                                <label key={val} className="flex flex-col items-center">
                                                    <input
                                                        type="radio"
                                                        name={`ipc_f_guess_${i}`}
                                                        value={val}
                                                        checked={parseInt(ratings[i].ipc_f_guess) === val}
                                                        onChange={() => handleChange(i, 'ipc_f_guess', val.toString())}
                                                        className="peer hidden"
                                                    />
                                                    <div className={`w-4 h-4 rounded-full border-2 ${parseInt(ratings[i].ipc_f_guess) === val ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400'}`} />
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

                            )}
                        </div>

                        <label>
                            Extra Feedback
                            <textarea
                                rows="3"
                                value={ratings[i].feedback}
                                onChange={e => handleChange(i, 'feedback', e.target.value)}
                                className="block w-full p-2 border rounded"
                                placeholder="Kommentare zu diesem Dialog..."
                            />
                        </label>
                    </div>
                </div>
            ))}

            {/* 🔵 Overall Evaluation Section */}
            <div className="space-y-4 border rounded p-4">
                <h4 className="font-bold">Gesamteindruck</h4>

                <label>
                    Bitte gib eine Reihenfolge der Dialoge an (z.&nbsp;B. 2, 1, 3 für beste bis schlechteste)
                    <input
                        type="text"
                        value={overallFeedback.ranking}
                        onChange={e => setOverallFeedback({ ...overallFeedback, ranking: e.target.value })}
                        className="block w-full p-2 border rounded"
                        placeholder="z.B. 2, 1, 3"
                    />
                </label>


                <label>
                    Warum?
                    <textarea
                        rows="3"
                        value={overallFeedback.reason}
                        onChange={e => setOverallFeedback({ ...overallFeedback, reason: e.target.value })}
                        className="block w-full p-2 border rounded"
                    />
                </label>

                <label>
                    Wie divers waren die Patienten deiner Meinung nach?
                    <select
                        value={overallFeedback.diversity}
                        onChange={e => setOverallFeedback({ ...overallFeedback, diversity: e.target.value })}
                        className="block w-full p-2 border rounded"
                    >
                        <option value="1">Sehr ähnlich</option>
                        <option value="2">Ähnlich</option>
                        <option value="3">Neutral</option>
                        <option value="4">Unterschiedlich</option>
                        <option value="5">Sehr unterschiedlich</option>
                    </select>
                </label>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!allRatingsValid || isLoading}
                className="relative flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
                {isLoading && (
                    <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                        />
                    </svg>
                )}
                {isLoading ? 'Absenden...' : 'Absenden und Fortfahren'}
            </button>

        </div>
    )
}

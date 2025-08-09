import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MAX_TIME_MINUTES = 25
const END_TIME_KEY = 'chatEndTime'

// Helper to generate random [friendliness, dominance] values
const randomIcm = () => [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)]

export default function Chat({
    messages,
    setMessages,
    dialogues,
    setDialogues,
    botId,
    setCurrentBot,
    botVariants,
    logFilenames,
    setLogFilenames,
    userID
}) {
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [remainingMinutes, setRemainingMinutes] = useState(MAX_TIME_MINUTES)
    const [llmIcm, setLlmIcm] = useState([2, 2]) // <-- ICM state
    const [patient, setPatient] = useState('')

    // Simple, robust countdown using a fixed endTime in localStorage
    useEffect(() => {
        let endTime = parseInt(localStorage.getItem(END_TIME_KEY), 10)
        if (!endTime || Date.now() > endTime) {
            endTime = Date.now() + MAX_TIME_MINUTES * 60_000
            localStorage.setItem(END_TIME_KEY, String(endTime))
        }

        const updateTime = () => {
            const diff = endTime - Date.now()
            setRemainingMinutes(Math.max(0, Math.ceil(diff / 60000)))
        }

        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    const sendMessage = async () => {
        if (!input.trim()) return

        const newMessages = [...messages, { role: 'user', content: input }]
        setMessages(newMessages)
        setInput('')
        setLoading(true)

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
                user: input,
                history: newMessages,
                bot: botId,
                llm_icm: llmIcm, // <-- include current ICM state
                patient: patient
            })

            setMessages([...newMessages, { role: 'assistant', content: res.data.response }])

            if (res.data.patient !== undefined) setPatient(res.data.patient)
            if (res.data.llm_icm !== undefined) setLlmIcm(res.data.llm_icm)
        } catch (err) {
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const startNewDialogue = async () => {
        if (messages.length > 0) {
            const updatedDialogues = [...dialogues, { bot: botId, turns: messages }]
            setDialogues(updatedDialogues)

            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/save-dialogue`, {
                    dialogue: messages,
                    index: updatedDialogues.length,
                    bot: botId,
                    userid: userID
                })
                const filename = response.data.filename
                setLogFilenames([...logFilenames, filename])
            } catch (err) {
                console.error('Error saving dialogue:', err)
            }

            const nextIdx = (botVariants.indexOf(botId) + 1) % botVariants.length
            setCurrentBot(botVariants[nextIdx])
        }

        setMessages([])
        setInput('')
        setPatient('')
        setLlmIcm([2, 2]) // <-- reset ICM state for next session
    }

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow max-h-96 overflow-y-auto">
                {messages.map((m, idx) => (
                    <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                        <p className={m.role === 'user' ? 'text-blue-700' : 'text-gray-800'}>
                            <strong>{m.role === 'user' ? 'Du' : 'Patient'}:</strong> {m.content}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-grow p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 transition"
                    placeholder="Starte Hier die Konversation"
                />
                <button
                    onClick={sendMessage}
                    disabled={loading || messages.length >= 16}
                    className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                    {loading ? 'Sendet' : 'Senden'}
                </button>
            </div>

            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{remainingMinutes} Minute(n) übrig</p>
                {messages.length >= 16 && (
                    <p className="text-sm text-gray-500">Maximum von 8 turns (16 Nachrichten) erreicht.</p>
                )}
                <button
                    onClick={startNewDialogue}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring focus:ring-gray-300 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                    Starte neuen Dialog
                </button>
            </div>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded text-sm my-2">
                <p>
                    Bitte führe <strong>mindestens 5 Dialogrunden</strong> pro Konversation durch und versuche so viele Konversationen (min. 4) wie möglich in der Zeit zu schaffen.
                </p>
                <p>Du bist ein <strong>Arzt</strong> der mit dem Patienten redet</p>
            </div>

            {dialogues.length > 0 && (
                <p className="text-sm text-gray-500">Du hast {dialogues.length} Dialog(e) abgeschlossen.</p>
            )}
        </div>
    )
}

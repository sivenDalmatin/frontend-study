import React, { useEffect, useState } from 'react'
import axios from 'axios'

const START_TIME_KEY = 'chatStartTime'

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
    const [elapsedMinutes, setElapsedMinutes] = useState(0) // <-- count-up minutes
    const [llmIcm, setLlmIcm] = useState([2, 2]) // <-- ICM state
    const [patient, setPatient] = useState('')

    // Simple, robust count-up using a fixed startTime in localStorage
    useEffect(() => {
        let startTime = Number(localStorage.getItem(START_TIME_KEY))
        // Reset if missing, invalid, or somehow in the future
        if (!Number.isFinite(startTime) || startTime <= 0 || startTime > Date.now()) {
            startTime = Date.now()
            localStorage.setItem(START_TIME_KEY, String(startTime))
        }

        const updateTime = () => {
            const diff = Date.now() - startTime
            setElapsedMinutes(Math.max(0, Math.floor(diff / 60000)))
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

            const meta = (res.data.user_ipc && res.data.bot_ipc_used) ? {
                user_ipc: res.data.user_ipc,           // { friendliness, dominance }
                bot_ipc_used: res.data.bot_ipc_used,   // IPC used for THIS reply
                bot_ipc_next: res.data.bot_ipc_next || (
                    res.data.llm_icm ? { friendliness: res.data.llm_icm[0], dominance: res.data.llm_icm[1] } : undefined
                )
            } : undefined

            setMessages([...newMessages, { role: 'assistant', content: res.data.response, meta }])

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

        // ⬇️ Reset the timer for the new dialogue
        const now = Date.now()
        localStorage.setItem(START_TIME_KEY, String(now))
        setElapsedMinutes(0)
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
                <p className="text-sm text-gray-500">{elapsedMinutes} Minute(n) vergangen</p>
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

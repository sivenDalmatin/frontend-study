// src/App.jsx

import React, { useState } from 'react'
import axios from 'axios'
import Chat from './components/Chat'
import Classification from './components/Classification'
import Evaluation from './components/Evaluation'
import Intro from './components/Intro'
import UserInfoForm from './components/UserInfoForm'

export default function App() {
  const [step, setStep] = useState('userinfo') // userinfo -> intro -> dialogue -> evaluation -> classification
  const [userInfo, setUserInfo] = useState(null)
  const [dialogues, setDialogues] = useState([])
  const [logFilenames, setLogFilenames] = useState([])
  const [messages, setMessages] = useState([])
  const [showIntroOverlay, setShowIntroOverlay] = useState(false)

  const botVariants = ['gpt_default', 'icm_agent_0.5', 'neutral_agent_0.8']
  const [currentBot, setCurrentBot] = useState(botVariants[0])

  const handleUserInfoSubmit = async (data) => {
    console.log(data)
    setUserInfo(data)
    try {
      await axios.post("`${import.meta.env.VITE_BACKEND_URL}/register-user", data)
    } catch (err) {
      console.error("User info not saved:", err)
    }
    setStep('intro')
  }

  const saveDialogue = async () => {
    if (messages.length === 0) return

    const updatedDialogues = [...dialogues, { bot: currentBot, turns: messages }]
    setDialogues(updatedDialogues)

    try {
      const response = await axios.post('`${import.meta.env.VITE_BACKEND_URL}/save-dialogue', {
        dialogue: messages,
        index: updatedDialogues.length,
        bot: currentBot,
        userid: userInfo?.id
      })
      const filename = response.data.filename
      setLogFilenames([...logFilenames, filename])
    } catch (err) {
      console.error('Error saving dialogue:', err)
    }

    setMessages([])
    const nextIdx = (botVariants.indexOf(currentBot) + 1) % botVariants.length
    setCurrentBot(botVariants[nextIdx])
  }

  return (
    <>
      <main className="max-w-3xl mx-auto p-6 space-y-8 relative">
        <div className="flex justify-end">
          <button
            onClick={() => setShowIntroOverlay(true)}
            className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded text-sm"
          >
            Intro anzeigen
          </button>
        </div>

        {step === 'userinfo' && <UserInfoForm onSubmit={handleUserInfoSubmit} />}
        {step === 'intro' && <Intro onStart={() => setStep('dialogue')} />}
        {step === 'dialogue' && (
          <Chat
            messages={messages}
            setMessages={setMessages}
            dialogues={dialogues}
            setDialogues={setDialogues}
            botId={currentBot}
            setCurrentBot={setCurrentBot}
            botVariants={botVariants}
            logFilenames={logFilenames}
            setLogFilenames={setLogFilenames}
            userID={userInfo?.id}
          />
        )}
        {step === 'evaluation' && (
          <Evaluation
            dialogues={dialogues}
            logFilenames={logFilenames}
            userId={userInfo?.id}
            onNext={() => setStep('classification')}
          />
        )}
        {step === 'classification' && <Classification userId={userInfo?.id} />}

        {step === 'dialogue' && (
          <div className="flex justify-end">
            <button
              onClick={async () => {
                if (messages.length > 0) {
                  await saveDialogue()
                }
                if (dialogues.length >= 2) {
                  setStep('evaluation')
                } else {
                  alert('Bitte führe mindestens 3 Dialoge, bevor du fortfährst.')
                }
              }}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              Beende Dialogphase
            </button>
          </div>
        )}
      </main>

      {showIntroOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-4xl w-full relative">
            <button
              onClick={() => setShowIntroOverlay(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <Intro onStart={() => setShowIntroOverlay(false)} />
          </div>
        </div>
      )}
    </>
  )
}

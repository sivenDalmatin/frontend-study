import React from 'react'

export default function Intro({ onStart }) {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-6 p-6">
      <h1 className="text-2xl font-bold">Willkommen bei dieser Patientensimulation Studie</h1>
      <p className="text-gray-700">
        Danke für Dein Interesse. KI ist momentan überall. ChatGPT, Gemini und ähnliche hast Du sicher schon in den letzten Jahren kennengelernt.
        Dieses Projekt möchte mithilfe dieser Technologie die Kommunikative Kompetenz von Medizinstudenten verbessern. Dazu habe Ich einen Chatbot kreiert, der möglichst realistische, aber auch diverse Patienten darstellen soll.
      </p>
      <p className='text-gray-700 font-bold'>
        Die Studie ist in drei Teilen aufgebaut:
      </p>
      <p className="text-gray-700">
        Schreiben mit dem Chatbot
      </p>
      <p className="text-gray-700">
        Eine kleine Evaluation dieser Konversationen
      </p>
      <p className="text-gray-700">
        Die Evaluation ein paar andere Konversationen.
      </p>
      <p className="text-gray-700">
        Zuerst sollst Du mit dem Chatbot hin und her schreiben. Du spielst dabei den Arzt und möchtest natürlich dem Patienten helfen. Es ist nicht wichtig eine korrekte Diagnose zu stellen. Es geht eher um die Persönlichkeit des Patienten.
      </p>
      <p className="text-gray-700">
        Jeder Dialog ist auf 8 Nachrichten begrenzt. Diese musst du nicht ausreizen wenn Du merkst, dass diese Konversation nirgendwo mehr hinführt.
      </p>
      <p className="text-gray-700">
        Du musst mindestens 4 Dialogpartner durchgehen um ein Gefühl für die Diversität der Patienten zu bekommen.
      </p>
      <p className="text-gray-700 italic">
        Du hast 25 Minuten für die Dialoge, 10 Minuten für die erste Evaluation und 10 Minuten für die 2. Evalutation
      </p>
      <button
        onClick={onStart}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
      >
        Fortfahren
      </button>
    </div>
  )
}
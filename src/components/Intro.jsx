import React from 'react'

export default function Intro({ onStart }) {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-6 p-6">
      <h1 className="text-2xl font-bold">Willkommen bei dieser Studie zu KI generierten Patientensimulation</h1>
      <p className="text-gray-700">
        Danke für Dein Interesse. KI ist momentan überall. ChatGPT, Gemini und ähnliche hast Du sicher schon in den letzten Jahren kennengelernt.
        Dieses Projekt möchte mithilfe dieser Technologie die Kommunikative Kompetenz von Medizinstudenten verbessern. Dazu habe Ich einen Chatbot kreiert, der möglichst realistische, aber auch diverse Patienten darstellen soll.
      </p>
      <p className='text-gray-700 font-bold'>
        Die Studie ist in drei Teilen aufgebaut:
      </p>
      <p className="text-gray-700">
        Konversation mit dem Chatbot.
      </p>
      <p className="text-gray-700">
        Evaluation der gehaltenen Konversationen.
      </p>
      <p className="text-gray-700">
        Evaluation anderer Konversationsausschnitte.
      </p>
      <p className="text-gray-700">
        Zuerst sollst Du Konversationen mit dem Chatbot halten. Du spielst den Arzt und möchtest dem Patienten helfen. Die medizinische Korrektheit ist nicht relevant. Es geht um die Persönlichkeit des Patienten.
      </p>
      <p className="text-gray-700">
        Jeder Dialog ist auf 8 Nachrichten begrenzt. Diese musst du nicht ausreizen, wenn Du merkst, dass eine Konversation an ihrem inhaltlichen Ende steht.
      </p>
      <p className="text-gray-700">
        Du hast 25 Minuten um die Dialoge durchzuführen. Das Minimum an Konversationen dass du halten sollst sind vier Konversationen, besser sind aber mehr
      </p>
      <p className="text-gray-700 italic">
        Nach den Dialogen hast du 10 Minuten für die erste Evaluation und 10 Minuten für die 2. Evalutation
      </p>
      <p className='text-red-600 italic'>Bitte führe diese Umfrage am Stück durch und lade die Seite nicht neu</p>
      <button
        onClick={onStart}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
      >
        Fortfahren
      </button>
    </div>
  )
}
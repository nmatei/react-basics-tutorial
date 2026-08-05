// Shell-ul aplicatiei: tine registrul de demo-uri si pasul activ, niciodata
// codul unui demo. Un pas nou = un fisier in src/demos/ + o intrare in `demos`.

import { useState, type ReactNode } from 'react'
import './App.css'
import { Welcome } from './components/Welcome'
import { Counter } from './demos/Counter'

// ReactNode = orice poate fi randat (element, text, null). `element` chiar tine
// un element JSX, adica descrierea deja construita a demo-ului.
type Demo = { id: string; step: number; title: string; element: ReactNode }

const demos: Demo[] = [
  { id: 'welcome', step: 1, title: 'Structura proiectului', element: <Welcome /> },
  { id: 'counter', step: 2, title: 'useState', element: <Counter /> },
]

function App() {
  // Setter-ul lipseste inca: meniul de navigare vine cu o lecție ulterioara.
  // Pana atunci schimbi pasul activ modificand id-ul de aici.
  const [activeId] = useState('counter')

  // `?? demos[0]` face ca `active` sa nu fie niciodata undefined — asa evitam
  // `!` (non-null assertion), care e interzis in acest proiect.
  const active = demos.find((d) => d.id === activeId) ?? demos[0]

  return (
    <>
      <h1>
        Pas {active.step} — {active.title}
      </h1>
      {active.element}
    </>
  )
}

export default App

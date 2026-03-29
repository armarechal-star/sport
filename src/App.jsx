import { useState } from 'react'
import ExerciseLibrary from './components/ExerciseLibrary'
import Programs from './components/Programs'
import Session from './components/Session'
import History from './components/History'

function NavIcon({ name }) {
  if (name === 'programs') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/>
    </svg>
  )
  if (name === 'exercises') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6.5 6.5h11M6.5 12h11M6.5 17.5h11"/><circle cx="3.5" cy="6.5" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="17.5" r="1"/>
    </svg>
  )
  if (name === 'history') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )
  return null
}

export default function App() {
  const [tab, setTab] = useState('programs')
  const [session, setSession] = useState(null) // active program

  if (session) {
    return (
      <Session
        program={session}
        onFinish={() => { setSession(null); setTab('history') }}
      />
    )
  }

  return (
    <>
      {tab === 'programs' && <Programs onStartSession={setSession} />}
      {tab === 'exercises' && <ExerciseLibrary />}
      {tab === 'history' && <History />}

      <nav className="bottom-nav">
        {[
          { id: 'programs', label: 'Programmes' },
          { id: 'exercises', label: 'Exercices' },
          { id: 'history', label: 'Historique' },
        ].map(n => (
          <button
            key={n.id}
            className={`nav-item ${tab === n.id ? 'active' : ''}`}
            onClick={() => setTab(n.id)}
          >
            <NavIcon name={n.id} />
            {n.label}
          </button>
        ))}
      </nav>
    </>
  )
}

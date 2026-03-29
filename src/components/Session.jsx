import { useState, useEffect, useRef } from 'react'
import { getExercises, getSessions, saveSessions, uid } from '../store'

function Timer({ seconds, onDone }) {
  const [remaining, setRemaining] = useState(seconds)
  const ref = useRef(null)

  useEffect(() => {
    ref.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(ref.current)
          onDone()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [])

  const m = Math.floor(remaining / 60).toString().padStart(2, '0')
  const s = (remaining % 60).toString().padStart(2, '0')
  const pct = (1 - remaining / seconds) * 100

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ textAlign: 'center' }}>
        <div className="modal-handle" />
        <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Temps de repos</p>
        <div className="timer-display">{m}:{s}</div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
        <button className="btn btn-secondary btn-full" style={{ marginTop: 20 }} onClick={onDone}>
          Passer
        </button>
      </div>
    </div>
  )
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.8C6.8 19 12 19 12 19s4.8 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 14.5v-5l5.5 2.5-5.5 2.5z"/>
    </svg>
  )
}

export default function Session({ program, onFinish }) {
  const exercises = getExercises()
  const ex = (id) => exercises.find(e => e.id === id)

  // Build session data from program
  const [sessionData, setSessionData] = useState(() =>
    program.exercises.map(item => ({
      programItem: item,
      sets: Array.from({ length: item.sets }, (_, i) => ({
        id: uid(),
        reps: item.reps,
        weight: item.weight || '',
        done: false,
      }))
    }))
  )

  const [timer, setTimer] = useState(null) // { seconds }
  const startTime = useRef(Date.now())

  const totalSets = sessionData.reduce((s, ex) => s + ex.sets.length, 0)
  const doneSets = sessionData.reduce((s, ex) => s + ex.sets.filter(s => s.done).length, 0)
  const progress = totalSets > 0 ? (doneSets / totalSets) * 100 : 0

  function updateSet(exIdx, setIdx, key, val) {
    setSessionData(prev => {
      const next = prev.map((e, ei) => ei !== exIdx ? e : {
        ...e,
        sets: e.sets.map((s, si) => si !== setIdx ? s : { ...s, [key]: val })
      })
      return next
    })
  }

  function toggleDone(exIdx, setIdx) {
    const set = sessionData[exIdx].sets[setIdx]
    const rest = sessionData[exIdx].programItem.rest
    if (!set.done && rest > 0) {
      setTimer({ seconds: rest })
    }
    updateSet(exIdx, setIdx, 'done', !set.done)
  }

  function addSet(exIdx) {
    const item = sessionData[exIdx]
    const last = item.sets[item.sets.length - 1]
    setSessionData(prev => prev.map((e, ei) => ei !== exIdx ? e : {
      ...e,
      sets: [...e.sets, { id: uid(), reps: last?.reps || '', weight: last?.weight || '', done: false }]
    }))
  }

  function removeSet(exIdx, setIdx) {
    setSessionData(prev => prev.map((e, ei) => ei !== exIdx ? e : {
      ...e,
      sets: e.sets.filter((_, si) => si !== setIdx)
    }))
  }

  function handleFinish() {
    const duration = Math.round((Date.now() - startTime.current) / 1000 / 60)
    const session = {
      id: uid(),
      programId: program.id,
      programName: program.name,
      date: new Date().toISOString(),
      duration,
      exercises: sessionData.map(item => ({
        exerciseId: item.programItem.exerciseId,
        sets: item.sets.filter(s => s.done).map(s => ({ reps: s.reps, weight: s.weight }))
      }))
    }
    const sessions = getSessions()
    saveSessions([session, ...sessions])
    onFinish()
  }

  return (
    <div className="page">
      {timer && <Timer seconds={timer.seconds} onDone={() => setTimer(null)} />}

      <div style={{ marginBottom: 16 }}>
        <div className="row-between">
          <div>
            <div className="page-title">{program.name}</div>
            <div className="card-sub">{doneSets}/{totalSets} séries</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm('Abandonner la séance ?')) onFinish() }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="progress-bar" style={{ marginTop: 10 }}>
          <div className="progress-fill" style={{ width: progress + '%' }} />
        </div>
      </div>

      {sessionData.map((item, exIdx) => {
        const exercise = ex(item.programItem.exerciseId)
        const allDone = item.sets.every(s => s.done)
        return (
          <div className="card" key={item.programItem.id} style={{ opacity: allDone ? 0.75 : 1 }}>
            <div className="exercise-header">
              <div className="exercise-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div className="card-title">{exercise?.name || '?'}</div>
                <div className="card-sub">{exercise?.category} · Repos {item.programItem.rest}s</div>
              </div>
              {exercise?.youtubeUrl && (
                <a href={exercise.youtubeUrl} target="_blank" rel="noopener noreferrer" className="yt-btn">
                  <YoutubeIcon /> Vidéo
                </a>
              )}
            </div>

            <div className="col-labels">
              <div className="col-label">#</div>
              <div className="col-label">Reps</div>
              <div className="col-label">Kg</div>
              <div className="col-label">Repos</div>
              <div className="col-label">✓</div>
            </div>

            {item.sets.map((set, setIdx) => (
              <div key={set.id} className={`set-row ${set.done ? 'set-done' : ''}`}>
                <div className="set-num">{setIdx + 1}</div>
                <input
                  className="set-input"
                  value={set.reps}
                  onChange={e => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                  placeholder="10"
                />
                <input
                  className="set-input"
                  value={set.weight}
                  onChange={e => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                  placeholder="—"
                  type="number"
                />
                <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                  {item.programItem.rest}s
                </div>
                <button
                  className="btn btn-sm"
                  style={{
                    background: set.done ? 'var(--success)' : 'var(--surface2)',
                    color: set.done ? 'white' : 'var(--text-muted)',
                    border: '1px solid ' + (set.done ? 'var(--success)' : '#2a2a4a'),
                    padding: '6px 8px',
                  }}
                  onClick={() => toggleDone(exIdx, setIdx)}
                >
                  ✓
                </button>
              </div>
            ))}

            <div className="row" style={{ gap: 8, marginTop: 10 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => addSet(exIdx)}>+ Série</button>
              {item.sets.length > 1 && (
                <button className="btn btn-ghost btn-sm" style={{ color: '#e94560' }}
                  onClick={() => removeSet(exIdx, item.sets.length - 1)}>
                  − Série
                </button>
              )}
            </div>
          </div>
        )
      })}

      <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} onClick={handleFinish}>
        Terminer la séance
      </button>
    </div>
  )
}

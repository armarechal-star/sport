import { useState, useEffect, useRef } from 'react'
import { getExercises, getSessions, saveSessions, uid } from '../store'

function Timer({ seconds, onDone }) {
  const [remaining, setRemaining] = useState(seconds)
  const ref = useRef(null)

  useEffect(() => {
    ref.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(ref.current); onDone(); return 0 }
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
        <button className="btn btn-secondary btn-full" style={{ marginTop: 20 }} onClick={onDone}>Passer</button>
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

function buildSessionData(program) {
  return program.exercises.map(item => {
    if (item.type === 'circuit') {
      return {
        type: 'circuit',
        programItem: item,
        currentRound: 0,
        rounds: Array.from({ length: item.rounds }, () =>
          item.circuitExercises.map(ce => ({
            id: uid(), exerciseId: ce.exerciseId,
            reps: ce.reps, weight: ce.weight, done: false,
          }))
        ),
      }
    }
    const sets = (item.variableSets && item.setsData?.length > 0)
      ? item.setsData.map(s => ({ id: uid(), reps: s.reps, weight: s.weight, done: false }))
      : Array.from({ length: item.sets }, () => ({ id: uid(), reps: item.reps, weight: item.weight || '', done: false }))
    return { type: 'exercise', programItem: item, sets }
  })
}

export default function Session({ program, onFinish }) {
  const exercises = getExercises()
  const ex = (id) => exercises.find(e => e.id === id)

  const [sessionData, setSessionData] = useState(() => buildSessionData(program))
  const [timer, setTimer] = useState(null)
  const startTime = useRef(Date.now())

  const totalItems = sessionData.reduce((acc, item) => {
    if (item.type === 'circuit') return acc + item.rounds.flat().length
    return acc + item.sets.length
  }, 0)

  const doneItems = sessionData.reduce((acc, item) => {
    if (item.type === 'circuit') return acc + item.rounds.flat().filter(ce => ce.done).length
    return acc + item.sets.filter(s => s.done).length
  }, 0)

  const progress = totalItems > 0 ? (doneItems / totalItems) * 100 : 0

  // --- Exercice normal ---

  function updateSet(exIdx, setIdx, key, val) {
    setSessionData(prev => prev.map((e, ei) => ei !== exIdx ? e : {
      ...e, sets: e.sets.map((s, si) => si !== setIdx ? s : { ...s, [key]: val })
    }))
  }

  function toggleDone(exIdx, setIdx) {
    const set = sessionData[exIdx].sets[setIdx]
    const rest = sessionData[exIdx].programItem.rest
    if (!set.done && rest > 0) setTimer({ seconds: rest })
    updateSet(exIdx, setIdx, 'done', !set.done)
  }

  function addSet(exIdx) {
    const item = sessionData[exIdx]
    const last = item.sets[item.sets.length - 1]
    setSessionData(prev => prev.map((e, ei) => ei !== exIdx ? e : {
      ...e, sets: [...e.sets, { id: uid(), reps: last?.reps || '', weight: last?.weight || '', done: false }]
    }))
  }

  function removeSet(exIdx) {
    setSessionData(prev => prev.map((e, ei) => ei !== exIdx ? e : {
      ...e, sets: e.sets.slice(0, -1)
    }))
  }

  // --- Circuit ---

  function updateCircuitEx(exIdx, roundIdx, ceIdx, key, val) {
    setSessionData(prev => prev.map((item, ei) => ei !== exIdx ? item : {
      ...item,
      rounds: item.rounds.map((round, ri) => ri !== roundIdx ? round :
        round.map((ce, ci) => ci !== ceIdx ? ce : { ...ce, [key]: val })
      ),
    }))
  }

  function toggleCircuitEx(exIdx, roundIdx, ceIdx) {
    const item = sessionData[exIdx]
    const round = item.rounds[roundIdx]
    const isDone = !round[ceIdx].done
    const newRound = round.map((ce, ci) => ci === ceIdx ? { ...ce, done: isDone } : ce)
    const roundComplete = newRound.every(ce => ce.done)
    const isLastRound = roundIdx === item.programItem.rounds - 1

    setSessionData(prev => prev.map((it, ei) => {
      if (ei !== exIdx) return it
      const newRounds = it.rounds.map((r, ri) => ri !== roundIdx ? r : newRound)
      const newCurrentRound = (roundComplete && !isLastRound) ? roundIdx + 1 : it.currentRound
      return { ...it, rounds: newRounds, currentRound: newCurrentRound }
    }))

    if (isDone && roundComplete && !isLastRound && item.programItem.rest > 0) {
      setTimer({ seconds: item.programItem.rest })
    }
  }

  function handleFinish() {
    const duration = Math.round((Date.now() - startTime.current) / 1000 / 60)
    const session = {
      id: uid(),
      programId: program.id,
      programName: program.name,
      date: new Date().toISOString(),
      duration,
      exercises: sessionData.flatMap(item => {
        if (item.type === 'circuit') {
          return item.programItem.circuitExercises.map((ce, ceIdx) => ({
            exerciseId: ce.exerciseId,
            sets: item.rounds.map(round => ({ reps: round[ceIdx]?.reps, weight: round[ceIdx]?.weight }))
              .filter((_, ri) => item.rounds[ri]?.[ceIdx]?.done),
          }))
        }
        return [{ exerciseId: item.programItem.exerciseId, sets: item.sets.filter(s => s.done).map(s => ({ reps: s.reps, weight: s.weight })) }]
      }),
    }
    const sessions = getSessions()
    saveSessions([session, ...sessions])
    onFinish()
  }

  // --- Rendu exercice normal ---

  function renderExercise(item, exIdx) {
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
            <input className="set-input" value={set.reps}
              onChange={e => updateSet(exIdx, setIdx, 'reps', e.target.value)} placeholder="10" />
            <input className="set-input" value={set.weight} type="number"
              onChange={e => updateSet(exIdx, setIdx, 'weight', e.target.value)} placeholder="—" />
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
              {item.programItem.rest}s
            </div>
            <button className="btn btn-sm"
              style={{ background: set.done ? 'var(--success)' : 'var(--surface2)', color: set.done ? 'white' : 'var(--text-muted)', border: '1px solid ' + (set.done ? 'var(--success)' : '#2a2a4a'), padding: '6px 8px' }}
              onClick={() => toggleDone(exIdx, setIdx)}>✓</button>
          </div>
        ))}

        <div className="row" style={{ gap: 8, marginTop: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => addSet(exIdx)}>+ Série</button>
          {item.sets.length > 1 && (
            <button className="btn btn-ghost btn-sm" style={{ color: '#e94560' }} onClick={() => removeSet(exIdx)}>− Série</button>
          )}
        </div>
      </div>
    )
  }

  // --- Rendu circuit ---

  function renderCircuit(item, exIdx) {
    const { currentRound, rounds, programItem } = item
    const allDone = rounds.every(round => round.every(ce => ce.done))
    const currentRoundData = rounds[currentRound] || []
    const currentRoundDone = currentRoundData.every(ce => ce.done)

    return (
      <div className="card" key={programItem.id} style={{ opacity: allDone ? 0.75 : 1, border: '1px solid #1a2f4a' }}>
        {/* Header circuit */}
        <div className="row-between" style={{ marginBottom: 10 }}>
          <div className="row" style={{ gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(15,52,96,0.6)', color: '#4da6ff', padding: '3px 8px', borderRadius: 20 }}>
              CIRCUIT
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {programItem.circuitExercises.length} ex · Pause {programItem.rest}s
            </span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: allDone ? 'var(--success)' : '#4da6ff' }}>
            {allDone ? '✓' : `Tour ${currentRound + 1}/${programItem.rounds}`}
          </div>
        </div>

        {/* Indicateurs de tours */}
        <div className="row" style={{ gap: 4, marginBottom: 14 }}>
          {rounds.map((round, ri) => {
            const roundDone = round.every(ce => ce.done)
            const isCurrent = ri === currentRound
            return (
              <div key={ri} style={{
                flex: 1, height: 5, borderRadius: 3,
                background: roundDone ? 'var(--success)' : isCurrent ? '#4da6ff' : '#2a2a4a',
                transition: 'background 0.3s',
              }} />
            )
          })}
        </div>

        {/* Exercices du tour actuel */}
        {!allDone && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4da6ff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Tour {currentRound + 1} — enchaîner sans pause
            </div>

            {currentRoundData.map((ce, ceIdx) => {
              const exercise = ex(ce.exerciseId)
              return (
                <div key={ce.id}>
                  <div className="row-between" style={{ marginBottom: 4 }}>
                    <div className="row" style={{ gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{exercise?.name || '?'}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{exercise?.category}</span>
                    </div>
                    {exercise?.youtubeUrl && (
                      <a href={exercise.youtubeUrl} target="_blank" rel="noopener noreferrer" className="yt-btn">
                        <YoutubeIcon /> Vidéo
                      </a>
                    )}
                  </div>
                  <div className={`set-row ${ce.done ? 'set-done' : ''}`} style={{ marginBottom: 6 }}>
                    <div className="set-num">{ceIdx + 1}</div>
                    <input className="set-input" value={ce.reps} placeholder="10"
                      onChange={e => updateCircuitEx(exIdx, currentRound, ceIdx, 'reps', e.target.value)} />
                    <input className="set-input" value={ce.weight} placeholder="—" type="number"
                      onChange={e => updateCircuitEx(exIdx, currentRound, ceIdx, 'weight', e.target.value)} />
                    <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>—</div>
                    <button className="btn btn-sm"
                      style={{ background: ce.done ? 'var(--success)' : 'var(--surface2)', color: ce.done ? 'white' : 'var(--text-muted)', border: '1px solid ' + (ce.done ? 'var(--success)' : '#2a2a4a'), padding: '6px 8px' }}
                      onClick={() => toggleCircuitEx(exIdx, currentRound, ceIdx)}>✓</button>
                  </div>
                </div>
              )
            })}

            {currentRoundDone && !allDone && (
              <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>
                Tour {currentRound + 1} terminé !{programItem.rest > 0 ? ` Repos ${programItem.rest}s...` : ''}
              </div>
            )}
          </>
        )}

        {allDone && (
          <div style={{ textAlign: 'center', padding: 8, fontSize: 14, color: 'var(--success)', fontWeight: 600 }}>
            Circuit terminé — {programItem.rounds} tours ✓
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="page">
      {timer && <Timer seconds={timer.seconds} onDone={() => setTimer(null)} />}

      <div style={{ marginBottom: 16 }}>
        <div className="row-between">
          <div>
            <div className="page-title">{program.name}</div>
            <div className="card-sub">{doneItems}/{totalItems} séries</div>
          </div>
          <button className="btn btn-ghost btn-sm"
            onClick={() => { if (confirm('Abandonner la séance ?')) onFinish() }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="progress-bar" style={{ marginTop: 10 }}>
          <div className="progress-fill" style={{ width: progress + '%' }} />
        </div>
      </div>

      {sessionData.map((item, exIdx) =>
        item.type === 'circuit'
          ? renderCircuit(item, exIdx)
          : renderExercise(item, exIdx)
      )}

      <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} onClick={handleFinish}>
        Terminer la séance
      </button>
    </div>
  )
}

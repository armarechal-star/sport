import { useState } from 'react'
import { getSessions, getExercises, getPrograms, saveSessions } from '../store'

function fmt(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

function SessionDetail({ session, exercises, onClose, onDelete }) {
  const ex = (id) => exercises.find(e => e.id === id)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="row-between" style={{ marginBottom: 16 }}>
          <div>
            <div className="modal-title" style={{ marginBottom: 2 }}>{session.programName}</div>
            <div className="card-sub">{fmt(session.date)} · {session.duration} min</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ color: '#e94560' }} onClick={onDelete}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
          </button>
        </div>

        {session.exercises.map((item, i) => {
          const info = ex(item.exerciseId)
          if (item.sets.length === 0) return null
          return (
            <div key={i} style={{ marginBottom: 14 }}>
              <div className="section-title">{info?.name || '?'}</div>
              <div className="col-labels" style={{ gridTemplateColumns: '32px 1fr 1fr', gap: 8 }}>
                <div className="col-label">#</div>
                <div className="col-label">Reps</div>
                <div className="col-label">Kg</div>
              </div>
              {item.sets.map((s, si) => (
                <div key={si} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr', gap: 8, padding: '6px 0', borderBottom: '1px solid #1a1a2e' }}>
                  <div className="set-num">{si + 1}</div>
                  <div style={{ textAlign: 'center', fontSize: 14 }}>{s.reps}</div>
                  <div style={{ textAlign: 'center', fontSize: 14 }}>{s.weight || '—'}</div>
                </div>
              ))}
            </div>
          )
        })}

        <button className="btn btn-secondary btn-full" style={{ marginTop: 8 }} onClick={onClose}>Fermer</button>
      </div>
    </div>
  )
}

function ProgressChart({ data, label }) {
  if (data.length < 2) return null
  const max = Math.max(...data.map(d => d.value))
  return (
    <div>
      <div className="section-title" style={{ marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
        {data.slice(-10).map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{
              width: '100%',
              height: max > 0 ? (d.value / max * 50) + 10 : 10,
              background: 'var(--accent)',
              borderRadius: '3px 3px 0 0',
              opacity: i === data.slice(-10).length - 1 ? 1 : 0.5,
            }} />
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function History() {
  const [sessions, setSessions] = useState(getSessions)
  const [detail, setDetail] = useState(null)
  const [tab, setTab] = useState('history') // 'history' | 'progress'
  const [selExId, setSelExId] = useState(null)
  const exercises = getExercises()

  function deleteSession(id) {
    const list = sessions.filter(s => s.id !== id)
    setSessions(list)
    saveSessions(list)
    setDetail(null)
  }

  // Build progress data for selected exercise
  const progressData = selExId ? (() => {
    const points = []
    ;[...sessions].reverse().forEach(sess => {
      const item = sess.exercises.find(e => e.exerciseId === selExId)
      if (!item || item.sets.length === 0) return
      const maxWeight = Math.max(...item.sets.map(s => parseFloat(s.weight) || 0))
      const totalReps = item.sets.reduce((sum, s) => sum + (parseInt(s.reps) || 0), 0)
      points.push({ date: sess.date, value: maxWeight || totalReps, label: new Date(sess.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) })
    })
    return points
  })() : []

  // Exercises that appear in sessions
  const trackedExIds = [...new Set(sessions.flatMap(s => s.exercises.map(e => e.exerciseId)))]

  const totalVolume = sessions.reduce((sum, s) =>
    sum + s.exercises.reduce((es, ex) =>
      es + ex.sets.reduce((ss, set) =>
        ss + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0), 0), 0)

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Historique</div>
      </div>

      {sessions.length > 0 && (
        <div className="row" style={{ gap: 8, marginBottom: 16 }}>
          <div className="stat-box">
            <div className="stat-value">{sessions.length}</div>
            <div className="stat-label">Séances</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{Math.round(sessions.reduce((s, x) => s + (x.duration || 0), 0) / sessions.length || 0)} min</div>
            <div className="stat-label">Durée moy.</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{(totalVolume / 1000).toFixed(1)}t</div>
            <div className="stat-label">Volume total</div>
          </div>
        </div>
      )}

      <div className="row" style={{ gap: 8, marginBottom: 16 }}>
        <button className={`chip ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>Séances</button>
        <button className={`chip ${tab === 'progress' ? 'active' : ''}`} onClick={() => setTab('progress')}>Progression</button>
      </div>

      {tab === 'history' && (
        <>
          {sessions.length === 0 && (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <p>Aucune séance enregistrée</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Démarrez une séance depuis Programmes</p>
            </div>
          )}
          {sessions.map(s => {
            const totalSets = s.exercises.reduce((n, e) => n + e.sets.length, 0)
            return (
              <div className="card" key={s.id} onClick={() => setDetail(s)} style={{ cursor: 'pointer' }}>
                <div className="card-header">
                  <div>
                    <div className="card-title">{s.programName}</div>
                    <div className="card-sub">{fmt(s.date)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{s.duration} min</div>
                    <div className="card-sub">{totalSets} séries</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {s.exercises.filter(e => e.sets.length > 0).map((e, i) => (
                    <span key={i} className="badge badge-accent">
                      {exercises.find(ex => ex.id === e.exerciseId)?.name || '?'}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </>
      )}

      {tab === 'progress' && (
        <>
          {trackedExIds.length === 0 ? (
            <div className="empty-state">
              <p>Aucune donnée de progression</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {trackedExIds.map(id => {
                  const info = exercises.find(e => e.id === id)
                  return (
                    <button key={id} className={`chip ${selExId === id ? 'active' : ''}`}
                      onClick={() => setSelExId(id)}>
                      {info?.name || '?'}
                    </button>
                  )
                })}
              </div>
              {selExId && (
                <div className="card">
                  <ProgressChart data={progressData} label={`${exercises.find(e => e.id === selExId)?.name} — Charge max (kg)`} />
                  {progressData.length < 2 && (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 8 }}>
                      Il faut au moins 2 séances pour voir la progression
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {detail && (
        <SessionDetail
          session={detail}
          exercises={exercises}
          onClose={() => setDetail(null)}
          onDelete={() => deleteSession(detail.id)}
        />
      )}
    </div>
  )
}

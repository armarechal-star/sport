import { useState } from 'react'
import { getPrograms, savePrograms, getExercises, uid } from '../store'

function ProgramModal({ prog, onSave, onClose }) {
  const exercises = getExercises()
  const [name, setName] = useState(prog?.name || '')
  const [items, setItems] = useState(prog?.exercises || [])

  function addExercise() {
    setItems(prev => [...prev, {
      id: uid(),
      exerciseId: exercises[0]?.id || '',
      sets: 3,
      reps: '10',
      weight: '',
      rest: 90,
    }])
  }

  function updateItem(id, key, val) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [key]: val } : it))
  }

  function removeItem(id) {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  function handleSave() {
    if (!name.trim()) return
    onSave({ id: prog?.id || uid(), name, exercises: items })
  }

  const ex = (id) => exercises.find(e => e.id === id)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">{prog ? 'Modifier le programme' : 'Nouveau programme'}</div>

        <div className="form-group">
          <label>Nom du programme *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="ex: Push A - Lundi" autoFocus />
        </div>

        <div className="section-title" style={{ marginTop: 16 }}>Exercices</div>

        {items.map((item, i) => {
          const exInfo = ex(item.exerciseId)
          return (
            <div className="card" key={item.id} style={{ padding: 12, marginBottom: 8 }}>
              <div className="row-between" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>#{i + 1}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => removeItem(item.id)} style={{ color: '#e94560' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="form-group" style={{ marginBottom: 8 }}>
                <label>Exercice</label>
                <select value={item.exerciseId} onChange={e => updateItem(item.id, 'exerciseId', e.target.value)}>
                  {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name} ({ex.category})</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                <div>
                  <label>Séries</label>
                  <input type="number" className="set-input" value={item.sets} min="1"
                    onChange={e => updateItem(item.id, 'sets', parseInt(e.target.value) || 1)} />
                </div>
                <div>
                  <label>Reps</label>
                  <input className="set-input" value={item.reps} placeholder="10"
                    onChange={e => updateItem(item.id, 'reps', e.target.value)} />
                </div>
                <div>
                  <label>Charge (kg)</label>
                  <input className="set-input" value={item.weight} placeholder="-"
                    onChange={e => updateItem(item.id, 'weight', e.target.value)} />
                </div>
                <div>
                  <label>Pause (s)</label>
                  <input type="number" className="set-input" value={item.rest} min="0"
                    onChange={e => updateItem(item.id, 'rest', parseInt(e.target.value) || 0)} />
                </div>
              </div>
            </div>
          )
        })}

        {exercises.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 12 }}>
            Ajoutez d'abord des exercices dans la bibliothèque.
          </p>
        ) : (
          <button className="btn btn-secondary btn-full" onClick={addExercise} style={{ marginBottom: 16 }}>
            + Ajouter un exercice
          </button>
        )}

        <div className="row" style={{ gap: 8, marginTop: 8 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

export default function Programs({ onStartSession }) {
  const [programs, setPrograms] = useState(getPrograms)
  const [modal, setModal] = useState(null)
  const exercises = getExercises()

  const exName = (id) => exercises.find(e => e.id === id)?.name || '?'

  function handleSave(prog) {
    const list = programs.find(p => p.id === prog.id)
      ? programs.map(p => p.id === prog.id ? prog : p)
      : [...programs, prog]
    setPrograms(list)
    savePrograms(list)
    setModal(null)
  }

  function handleDelete(id) {
    if (!confirm('Supprimer ce programme ?')) return
    const list = programs.filter(p => p.id !== id)
    setPrograms(list)
    savePrograms(list)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Programmes</div>
        <button className="btn btn-primary btn-sm" onClick={() => setModal('new')}>+ Créer</button>
      </div>

      {programs.length === 0 && (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/></svg>
          <p>Aucun programme</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Créez le programme de votre coach</p>
        </div>
      )}

      {programs.map(prog => (
        <div className="card" key={prog.id}>
          <div className="card-header">
            <div>
              <div className="card-title">{prog.name}</div>
              <div className="card-sub">{prog.exercises.length} exercice{prog.exercises.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="row" style={{ gap: 4 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(prog)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(prog.id)} style={{ color: '#e94560' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {prog.exercises.map(it => (
              <span key={it.id} className="badge badge-accent">
                {exName(it.exerciseId)} · {it.sets}×{it.reps}
              </span>
            ))}
          </div>

          <button className="btn btn-success btn-full" onClick={() => onStartSession(prog)}>
            ▶ Démarrer la séance
          </button>
        </div>
      ))}

      {modal && (
        <ProgramModal
          prog={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

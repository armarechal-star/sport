import { useState } from 'react'
import { getPrograms, savePrograms, getExercises, uid } from '../store'

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

function ExerciseItem({ item, exercises, onUpdate, onRemove, index }) {
  function toggleVariableSets(checked) {
    if (checked) {
      const setsData = Array.from({ length: item.sets }, () => ({
        id: uid(), reps: item.reps, weight: item.weight,
      }))
      onUpdate({ ...item, variableSets: true, setsData })
    } else {
      onUpdate({ ...item, variableSets: false })
    }
  }

  function updateSetData(sIdx, key, val) {
    onUpdate({ ...item, setsData: item.setsData.map((s, i) => i === sIdx ? { ...s, [key]: val } : s) })
  }

  function addSetData() {
    const last = item.setsData[item.setsData.length - 1]
    onUpdate({
      ...item,
      sets: item.sets + 1,
      setsData: [...item.setsData, { id: uid(), reps: last?.reps || '', weight: last?.weight || '' }],
    })
  }

  function removeSetData(sIdx) {
    if (item.setsData.length <= 1) return
    onUpdate({
      ...item,
      sets: item.sets - 1,
      setsData: item.setsData.filter((_, i) => i !== sIdx),
    })
  }

  return (
    <div className="card" style={{ padding: 12, marginBottom: 8 }}>
      <div className="row-between" style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>#{index + 1}</span>
        <button className="btn btn-ghost btn-sm" onClick={onRemove} style={{ color: '#e94560' }}><XIcon /></button>
      </div>

      <div className="form-group" style={{ marginBottom: 8 }}>
        <label>Exercice</label>
        <select value={item.exerciseId} onChange={e => onUpdate({ ...item, exerciseId: e.target.value })}>
          {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name} ({ex.category})</option>)}
        </select>
      </div>

      {!item.variableSets && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div>
            <label>Séries</label>
            <input type="number" className="set-input" value={item.sets} min="1"
              onChange={e => onUpdate({ ...item, sets: parseInt(e.target.value) || 1 })} />
          </div>
          <div>
            <label>Reps</label>
            <input className="set-input" value={item.reps} placeholder="10"
              onChange={e => onUpdate({ ...item, reps: e.target.value })} />
          </div>
          <div>
            <label>Charge (kg)</label>
            <input className="set-input" value={item.weight} placeholder="—"
              onChange={e => onUpdate({ ...item, weight: e.target.value })} />
          </div>
          <div>
            <label>Pause (s)</label>
            <input type="number" className="set-input" value={item.rest} min="0"
              onChange={e => onUpdate({ ...item, rest: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
      )}

      {item.variableSets && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 28px', gap: 6, marginBottom: 4 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>#</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>Reps</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>Kg</div>
            <div />
          </div>
          {item.setsData.map((s, sIdx) => (
            <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 28px', gap: 6, marginBottom: 6 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', paddingTop: 8 }}>{sIdx + 1}</div>
              <input className="set-input" value={s.reps} placeholder="10"
                onChange={e => updateSetData(sIdx, 'reps', e.target.value)} />
              <input className="set-input" value={s.weight} placeholder="—"
                onChange={e => updateSetData(sIdx, 'weight', e.target.value)} />
              <button className="btn btn-ghost btn-sm" style={{ color: '#e94560', padding: '4px' }}
                onClick={() => removeSetData(sIdx)}>−</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
            <button className="btn btn-secondary btn-sm" onClick={addSetData}>+ Série</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <label style={{ margin: 0, whiteSpace: 'nowrap' }}>Pause (s)</label>
              <input type="number" className="set-input" value={item.rest} min="0"
                onChange={e => onUpdate({ ...item, rest: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
        </div>
      )}

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: 'var(--text-muted)' }}>
        <input type="checkbox" checked={!!item.variableSets}
          onChange={e => toggleVariableSets(e.target.checked)}
          style={{ width: 'auto', margin: 0 }} />
        Charges différentes par série
      </label>
    </div>
  )
}

function CircuitItem({ item, exercises, onUpdate, onRemove, index }) {
  function addCircuitEx() {
    onUpdate({
      ...item,
      circuitExercises: [...item.circuitExercises, {
        id: uid(), exerciseId: exercises[0]?.id || '', reps: '10', weight: '',
      }],
    })
  }

  function updateCircuitEx(cId, key, val) {
    onUpdate({
      ...item,
      circuitExercises: item.circuitExercises.map(ce => ce.id === cId ? { ...ce, [key]: val } : ce),
    })
  }

  function removeCircuitEx(cId) {
    if (item.circuitExercises.length <= 1) return
    onUpdate({ ...item, circuitExercises: item.circuitExercises.filter(ce => ce.id !== cId) })
  }

  return (
    <div className="card" style={{ padding: 12, marginBottom: 8, border: '1px solid #0f3460' }}>
      <div className="row-between" style={{ marginBottom: 10 }}>
        <div className="row" style={{ gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(15,52,96,0.6)', color: '#4da6ff', padding: '2px 8px', borderRadius: 20 }}>CIRCUIT</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>#{index + 1}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onRemove} style={{ color: '#e94560' }}><XIcon /></button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        <div>
          <label>Nombre de tours</label>
          <input type="number" className="set-input" value={item.rounds} min="1"
            onChange={e => onUpdate({ ...item, rounds: parseInt(e.target.value) || 1 })} />
        </div>
        <div>
          <label>Pause entre tours (s)</label>
          <input type="number" className="set-input" value={item.rest} min="0"
            onChange={e => onUpdate({ ...item, rest: parseInt(e.target.value) || 0 })} />
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: '#4da6ff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        Exercices enchaînés
      </div>

      {item.circuitExercises.map((ce, ceIdx) => (
        <div key={ce.id} style={{ display: 'grid', gridTemplateColumns: '1fr 56px 56px 28px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
          <select value={ce.exerciseId} onChange={e => updateCircuitEx(ce.id, 'exerciseId', e.target.value)}
            style={{ fontSize: 13, padding: '7px 8px' }}>
            {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
          </select>
          <input className="set-input" value={ce.reps} placeholder="Reps"
            onChange={e => updateCircuitEx(ce.id, 'reps', e.target.value)} />
          <input className="set-input" value={ce.weight} placeholder="Kg"
            onChange={e => updateCircuitEx(ce.id, 'weight', e.target.value)} />
          <button className="btn btn-ghost btn-sm" style={{ color: '#e94560', padding: '4px' }}
            onClick={() => removeCircuitEx(ce.id)}>−</button>
        </div>
      ))}

      <button className="btn btn-secondary btn-sm btn-full" onClick={addCircuitEx} style={{ marginTop: 4 }}>
        + Exercice au circuit
      </button>
    </div>
  )
}

function ProgramModal({ prog, onSave, onClose }) {
  const exercises = getExercises()
  const [name, setName] = useState(prog?.name || '')
  const [items, setItems] = useState(prog?.exercises || [])

  function addExercise() {
    setItems(prev => [...prev, {
      id: uid(), type: 'exercise',
      exerciseId: exercises[0]?.id || '',
      sets: 3, reps: '10', weight: '', rest: 90,
      variableSets: false, setsData: [],
    }])
  }

  function addCircuit() {
    setItems(prev => [...prev, {
      id: uid(), type: 'circuit',
      rounds: 3, rest: 60,
      circuitExercises: [
        { id: uid(), exerciseId: exercises[0]?.id || '', reps: '10', weight: '' },
        { id: uid(), exerciseId: exercises[1]?.id || exercises[0]?.id || '', reps: '10', weight: '' },
      ],
    }])
  }

  function updateItem(id, updated) {
    setItems(prev => prev.map(it => it.id === id ? updated : it))
  }

  function removeItem(id) {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  function handleSave() {
    if (!name.trim()) return
    onSave({ id: prog?.id || uid(), name, exercises: items })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">{prog ? 'Modifier le programme' : 'Nouveau programme'}</div>

        <div className="form-group">
          <label>Nom du programme *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="ex: Push A - Lundi" autoFocus />
        </div>

        <div className="section-title" style={{ marginTop: 16 }}>Exercices & Circuits</div>

        {items.map((item, i) => item.type === 'circuit' ? (
          <CircuitItem key={item.id} item={item} exercises={exercises} index={i}
            onUpdate={updated => updateItem(item.id, updated)}
            onRemove={() => removeItem(item.id)} />
        ) : (
          <ExerciseItem key={item.id} item={item} exercises={exercises} index={i}
            onUpdate={updated => updateItem(item.id, updated)}
            onRemove={() => removeItem(item.id)} />
        ))}

        {exercises.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 12 }}>
            Ajoutez d'abord des exercices dans la bibliothèque.
          </p>
        ) : (
          <div className="row" style={{ gap: 8, marginBottom: 16 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={addExercise}>+ Exercice</button>
            <button className="btn btn-secondary" style={{ flex: 1, borderColor: '#0f3460', color: '#4da6ff' }} onClick={addCircuit}>⟳ Circuit</button>
          </div>
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
              <div className="card-sub">{prog.exercises.length} élément{prog.exercises.length !== 1 ? 's' : ''}</div>
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
            {prog.exercises.map(it => it.type === 'circuit' ? (
              <span key={it.id} style={{ fontSize: 11, fontWeight: 600, background: 'rgba(15,52,96,0.5)', color: '#4da6ff', padding: '3px 8px', borderRadius: 20 }}>
                Circuit {it.rounds}T × {it.circuitExercises?.length || 0}ex
              </span>
            ) : (
              <span key={it.id} className="badge badge-accent">
                {exName(it.exerciseId)} · {it.variableSets ? `${it.setsData?.length || it.sets}× var.` : `${it.sets}×${it.reps}`}
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

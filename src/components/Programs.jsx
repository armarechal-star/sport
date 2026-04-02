import { useState, useRef, useEffect } from 'react'
import { getPrograms, savePrograms, getExercises, saveExercises, uid } from '../store'

const CATEGORIES = ['Poitrine', 'Dos', 'Épaules', 'Bras', 'Jambes', 'Abdos', 'Cardio', 'Autre']

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

function ExercisePicker({ exercises, value, onChange, onExerciseCreated }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('Tous')
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState('Autre')
  const inputRef = useRef(null)
  const newNameRef = useRef(null)
  const selected = exercises.find(e => e.id === value)

  useEffect(() => {
    if (open && !creating) setTimeout(() => inputRef.current?.focus(), 50)
    if (creating) setTimeout(() => newNameRef.current?.focus(), 50)
  }, [open, creating])

  const filtered = exercises.filter(e => {
    const matchCat = cat === 'Tous' || e.category === cat
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function pick(id) {
    onChange(id)
    setOpen(false)
    setSearch('')
    setCat('Tous')
  }

  function handleCreate() {
    if (!newName.trim()) return
    const newEx = { id: uid(), name: newName.trim(), category: newCat, youtubeUrl: '', notes: '' }
    onExerciseCreated(newEx)
    onChange(newEx.id)
    setOpen(false)
    setCreating(false)
    setNewName('')
    setNewCat('Autre')
    setSearch('')
  }

  return (
    <div>
      <button
        className="btn btn-secondary"
        style={{ width: '100%', justifyContent: 'space-between', textAlign: 'left', fontWeight: 400 }}
        onClick={() => setOpen(true)}
      >
        <span style={{ color: selected ? 'var(--text)' : 'var(--text-muted)' }}>
          {selected ? selected.name : 'Choisir un exercice…'}
        </span>
        {selected && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selected.category}</span>}
      </button>

      {open && (
        <div className="modal-overlay-full" onClick={() => { setOpen(false); setCreating(false) }}>
          <div className="modal-full" onClick={e => e.stopPropagation()}>

            <div className="modal-full-header">
              <div className="modal-handle" style={{ marginBottom: 10 }} />
              <div className="row-between" style={{ marginBottom: creating ? 0 : 10 }}>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--text-muted)' }}
                  onClick={() => creating ? setCreating(false) : setOpen(false)}>
                  {creating ? '← Retour' : 'Fermer'}
                </button>
                <span style={{ fontWeight: 700, fontSize: 16 }}>
                  {creating ? 'Nouvel exercice' : 'Choisir un exercice'}
                </span>
                {!creating
                  ? <button className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>+ Créer</button>
                  : <button className="btn btn-primary btn-sm" onClick={handleCreate}>Ajouter</button>
                }
              </div>
              {!creating && (
                <>
                  <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher par nom…" style={{ marginBottom: 8 }} />
                  <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                    {['Tous', ...CATEGORIES].map(c => (
                      <button key={c} className={`chip ${cat === c ? 'active' : ''}`}
                        style={{ whiteSpace: 'nowrap' }} onClick={() => setCat(c)}>{c}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="modal-full-body">
              {!creating ? (
                <>
                  {filtered.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 24 }}>
                      Aucun résultat — crée un exercice avec "+ Créer"
                    </p>
                  )}
                  {filtered.map(ex => (
                    <div key={ex.id} onClick={() => pick(ex.id)} style={{
                      padding: '11px 12px', borderRadius: 8, marginBottom: 6, cursor: 'pointer',
                      background: ex.id === value ? 'rgba(233,69,96,0.15)' : 'var(--surface2)',
                      border: '1px solid ' + (ex.id === value ? 'var(--accent)' : 'transparent'),
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontSize: 14, fontWeight: ex.id === value ? 600 : 400 }}>{ex.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ex.category}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="form-group" style={{ marginTop: 8 }}>
                    <label>Nom de l'exercice *</label>
                    <input ref={newNameRef} value={newName} onChange={e => setNewName(e.target.value)}
                      placeholder="ex: Curl incliné" onKeyDown={e => e.key === 'Enter' && handleCreate()} />
                  </div>
                  <div className="form-group">
                    <label>Catégorie</label>
                    <select value={newCat} onChange={e => setNewCat(e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ExerciseItem({ item, exercises, onUpdate, onRemove, onExerciseCreated, index }) {
  return (
    <div className="card" style={{ padding: 12, marginBottom: 8 }}>
      <div className="row-between" style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>#{index + 1}</span>
        <button className="btn btn-ghost btn-sm" onClick={onRemove} style={{ color: '#e94560' }}><XIcon /></button>
      </div>

      <div className="form-group" style={{ marginBottom: 8 }}>
        <label>Exercice</label>
        <ExercisePicker exercises={exercises} value={item.exerciseId}
          onChange={id => onUpdate({ ...item, exerciseId: id })}
          onExerciseCreated={onExerciseCreated} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
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

      <div>
        <label>Consignes du coach</label>
        <textarea
          value={item.coachNotes || ''}
          onChange={e => onUpdate({ ...item, coachNotes: e.target.value })}
          placeholder="Ex: Bien contrôler la descente, pause en bas…"
          style={{ minHeight: 52, fontSize: 13 }}
        />
      </div>
    </div>
  )
}

function CircuitItem({ item, exercises, onUpdate, onRemove, onExerciseCreated, index }) {
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
        <div key={ce.id} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
            <div style={{ flex: 1 }}>
              <ExercisePicker exercises={exercises} value={ce.exerciseId}
                onChange={id => updateCircuitEx(ce.id, 'exerciseId', id)}
                onExerciseCreated={onExerciseCreated} />
            </div>
            <button className="btn btn-ghost btn-sm" style={{ color: '#e94560', padding: '4px', flexShrink: 0 }}
              onClick={() => removeCircuitEx(ce.id)}>−</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 4 }}>
            <input className="set-input" value={ce.reps} placeholder="Reps"
              onChange={e => updateCircuitEx(ce.id, 'reps', e.target.value)} />
            <input className="set-input" value={ce.weight} placeholder="Kg"
              onChange={e => updateCircuitEx(ce.id, 'weight', e.target.value)} />
          </div>
          <textarea
            value={ce.coachNotes || ''}
            onChange={e => updateCircuitEx(ce.id, 'coachNotes', e.target.value)}
            placeholder="Consignes (optionnel)…"
            style={{ minHeight: 44, fontSize: 12 }}
          />
        </div>
      ))}

      <button className="btn btn-secondary btn-sm btn-full" onClick={addCircuitEx} style={{ marginTop: 4 }}>
        + Exercice au circuit
      </button>
    </div>
  )
}

function ProgramModal({ prog, onSave, onClose }) {
  const [exercises, setExercises] = useState(getExercises)
  const [name, setName] = useState(prog?.name || '')
  const [items, setItems] = useState(prog?.exercises || [])

  function handleExerciseCreated(newEx) {
    const updated = [...exercises, newEx]
    saveExercises(updated)
    setExercises(updated)
  }

  function addExercise() {
    setItems(prev => [...prev, {
      id: uid(), type: 'exercise',
      exerciseId: exercises[0]?.id || '',
      sets: 3, reps: '10', weight: '', rest: 90,
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
    <div className="modal-overlay-full" onClick={onClose}>
      <div className="modal-full" onClick={e => e.stopPropagation()}>

        <div className="modal-full-header">
          <div className="modal-handle" style={{ marginBottom: 10 }} />
          <div className="row-between" style={{ marginBottom: 10 }}>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--text-muted)' }} onClick={onClose}>Annuler</button>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{prog ? 'Modifier' : 'Nouveau programme'}</span>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>Enregistrer</button>
          </div>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Nom du programme (ex: Push A - Lundi)" autoFocus />
        </div>

        <div className="modal-full-body">
          <div className="section-title" style={{ marginTop: 8 }}>Exercices & Circuits</div>

          {items.map((item, i) => item.type === 'circuit' ? (
            <CircuitItem key={item.id} item={item} exercises={exercises} index={i}
              onUpdate={updated => updateItem(item.id, updated)}
              onRemove={() => removeItem(item.id)}
              onExerciseCreated={handleExerciseCreated} />
          ) : (
            <ExerciseItem key={item.id} item={item} exercises={exercises} index={i}
              onUpdate={updated => updateItem(item.id, updated)}
              onRemove={() => removeItem(item.id)}
              onExerciseCreated={handleExerciseCreated} />
          ))}

          <div className="row" style={{ gap: 8, marginTop: 4, marginBottom: 80 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={addExercise}>+ Exercice</button>
            <button className="btn btn-secondary" style={{ flex: 1, borderColor: '#0f3460', color: '#4da6ff' }} onClick={addCircuit}>⟳ Circuit</button>
          </div>
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

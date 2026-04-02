import { useState } from 'react'
import { getExercises, saveExercises, resetExercises, uid } from '../store'

const CATEGORIES = ['Poitrine', 'Dos', 'Épaules', 'Bras', 'Jambes', 'Abdos', 'Cardio', 'Autre']

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.8C6.8 19 12 19 12 19s4.8 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 14.5v-5l5.5 2.5-5.5 2.5z"/>
    </svg>
  )
}

function Modal({ ex, onSave, onClose }) {
  const [form, setForm] = useState(ex || { name: '', category: 'Autre', youtubeUrl: '', notes: '' })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.name.trim()) return
    onSave({ ...form, id: ex?.id || uid() })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">{ex ? 'Modifier l\'exercice' : 'Nouvel exercice'}</div>
        <div className="form-group">
          <label>Nom *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="ex: Squat" autoFocus />
        </div>
        <div className="form-group">
          <label>Catégorie</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Lien YouTube (tutoriel)</label>
          <input value={form.youtubeUrl} onChange={e => set('youtubeUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div className="form-group">
          <label>Notes / Conseils techniques</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Points de forme, conseils..." />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState(getExercises)
  const [modal, setModal] = useState(null) // null | 'new' | exercise object
  const [filter, setFilter] = useState('Tous')

  const cats = ['Tous', ...CATEGORIES]
  const filtered = filter === 'Tous' ? exercises : exercises.filter(e => e.category === filter)

  function handleSave(ex) {
    const list = exercises.find(e => e.id === ex.id)
      ? exercises.map(e => e.id === ex.id ? ex : e)
      : [...exercises, ex]
    setExercises(list)
    saveExercises(list)
    setModal(null)
  }

  function handleDelete(id) {
    if (!confirm('Supprimer cet exercice ?')) return
    const list = exercises.filter(e => e.id !== id)
    setExercises(list)
    saveExercises(list)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Exercices</div>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => {
            if (!confirm('Réinitialiser avec les 50 exercices par défaut ? Tes exercices perso seront supprimés.')) return
            const list = resetExercises()
            setExercises(list)
          }}>↺</button>
          <button className="btn btn-primary btn-sm" onClick={() => setModal('new')}>+ Ajouter</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 8 }}>
        {cats.map(c => (
          <button key={c} className={`chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M12 11v2m-2-1h4"/></svg>
          <p>Aucun exercice dans cette catégorie</p>
        </div>
      )}

      {filtered.map(ex => (
        <div className="card" key={ex.id}>
          <div className="card-header">
            <div>
              <div className="card-title">{ex.name}</div>
              <div className="card-sub">{ex.category}</div>
            </div>
            <div className="row" style={{ gap: 4 }}>
              {ex.youtubeUrl && (
                <a href={ex.youtubeUrl} target="_blank" rel="noopener noreferrer" className="yt-btn">
                  <YoutubeIcon /> Vidéo
                </a>
              )}
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(ex)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(ex.id)} style={{ color: '#e94560' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              </button>
            </div>
          </div>
          {ex.notes && <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{ex.notes}</p>}
        </div>
      ))}

      {modal && (
        <Modal
          ex={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

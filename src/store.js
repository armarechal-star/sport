// Simple localStorage-based store

const KEYS = {
  exercises: 'wt_exercises',
  programs: 'wt_programs',
  sessions: 'wt_sessions',
}

const SAMPLE_EXERCISES = [
  { id: '1', name: 'Squat', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8', notes: 'Dos droit, genoux dans l\'axe des pieds' },
  { id: '2', name: 'Développé couché', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg', notes: 'Omoplates serrées, pieds au sol' },
  { id: '3', name: 'Soulevé de terre', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q', notes: 'Barre proche du corps, gainage abdominal' },
  { id: '4', name: 'Tractions', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g', notes: 'Amplitude complète, coudes tirés vers les hanches' },
  { id: '5', name: 'Développé militaire', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI', notes: 'Gainage strict, pas de cambrage excessif' },
  { id: '6', name: 'Curl biceps', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo', notes: 'Coudes fixes, contraction en haut' },
]

function load(key, fallback) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function getExercises() {
  const stored = load(KEYS.exercises, null)
  if (!stored) {
    save(KEYS.exercises, SAMPLE_EXERCISES)
    return SAMPLE_EXERCISES
  }
  return stored
}

export function saveExercises(list) {
  save(KEYS.exercises, list)
}

export function getPrograms() {
  return load(KEYS.programs, [])
}

export function savePrograms(list) {
  save(KEYS.programs, list)
}

export function getSessions() {
  return load(KEYS.sessions, [])
}

export function saveSessions(list) {
  save(KEYS.sessions, list)
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

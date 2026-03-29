// Simple localStorage-based store

const KEYS = {
  exercises: 'wt_exercises',
  programs: 'wt_programs',
  sessions: 'wt_sessions',
}

const SAMPLE_EXERCISES = [
  // Poitrine
  { id: '1',  name: 'Développé couché (barre)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg', notes: 'Omoplates serrées, pieds au sol' },
  { id: '2',  name: 'Développé couché (haltères)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=VmB1G1K7v94', notes: 'Bonne amplitude, coudes à 45°' },
  { id: '3',  name: 'Développé incliné (barre)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=DbFgADa2PL8', notes: 'Inclinaison 30-45°, poitrine haute' },
  { id: '4',  name: 'Machine pec deck (butterfly)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=Z57CtFmRMxA', notes: 'Coudes légèrement fléchis, contraction en fin' },
  { id: '5',  name: 'Câbles croisés (crossover)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=taI4XduLpTk', notes: 'Légère inclinaison vers l\'avant, mains qui se croisent' },
  { id: '6',  name: 'Machine développé couché', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=xUm0BiZCWlQ', notes: 'Régler le siège pour que les poignées soient au niveau de la poitrine' },
  { id: '7',  name: 'Dips (pectoraux)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As', notes: 'Pencher le buste vers l\'avant, coudes légèrement écartés' },
  // Dos
  { id: '8',  name: 'Soulevé de terre', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q', notes: 'Barre proche du corps, gainage abdominal' },
  { id: '9',  name: 'Tractions (lest)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g', notes: 'Amplitude complète, coudes tirés vers les hanches' },
  { id: '10', name: 'Tirage vertical (câble)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc', notes: 'Barre tirée vers le menton, omoplates serrées' },
  { id: '11', name: 'Tirage horizontal (câble)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=GZbfZ033f74', notes: 'Coudes serrés le long du corps, poitrine bombée' },
  { id: '12', name: 'Machine tirage dos', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc', notes: 'Dos droit, tirer avec les coudes' },
  { id: '13', name: 'Rowing barre', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=9efgcAjQe7E', notes: 'Buste incliné à 45°, barre tirée vers le nombril' },
  { id: '14', name: 'Rowing haltère unilatéral', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=roCP6wCXPqo', notes: 'S\'appuyer sur un banc, coude tiré vers le plafond' },
  { id: '15', name: 'Hyperextensions (lombaires)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=ph3pddpKzzw', notes: 'Garder le dos plat, ne pas hyperétendre' },
  // Jambes
  { id: '16', name: 'Squat barre', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8', notes: 'Dos droit, genoux dans l\'axe des pieds' },
  { id: '17', name: 'Presse à cuisses', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', notes: 'Pieds à largeur d\'épaules, genoux ne dépassent pas les orteils' },
  { id: '18', name: 'Leg extension (quadriceps)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0', notes: 'Contraction complète en haut, descente contrôlée' },
  { id: '19', name: 'Leg curl couché (ischio)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs', notes: 'Hanches plaquées contre le banc, contraction en fin' },
  { id: '20', name: 'Leg curl assis (ischio)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=ELOCsoDSmrg', notes: 'Amplitude complète, bien contrôler la descente' },
  { id: '21', name: 'Hip thrust (fessiers)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=xDmFkJxPzeM', notes: 'Barre sur les hanches, bien contracter les fessiers en haut' },
  { id: '22', name: 'Fentes (haltères)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE', notes: 'Genou avant à 90°, genou arrière près du sol' },
  { id: '23', name: 'Mollets à la presse', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=FItCHjnQ4lU', notes: 'Amplitude complète, pause en bas' },
  { id: '24', name: 'Machine abducteurs', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=FPEHFRmQGwA', notes: 'Mouvement contrôlé, ne pas utiliser l\'élan' },
  { id: '25', name: 'Machine adducteurs', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=e37A5HLfQ2g', notes: 'Contrôler la phase d\'ouverture' },
  // Épaules
  { id: '26', name: 'Développé militaire (barre)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI', notes: 'Gainage strict, pas de cambrage excessif' },
  { id: '27', name: 'Développé épaules (haltères)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=HzIiNhHhhtA', notes: 'Coudes à 90° en bas, pousser sans verrouiller' },
  { id: '28', name: 'Élévations latérales (haltères)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo', notes: 'Légère flexion des coudes, pas d\'élan' },
  { id: '29', name: 'Élévations frontales (haltères)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=sOoBE4G6wbM', notes: 'Montée jusqu\'à hauteur des épaules' },
  { id: '30', name: 'Machine développé épaules', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog', notes: 'Régler la hauteur du siège, bien gaîner' },
  { id: '31', name: 'Tirage menton (barre)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=wd-qG-OTIes', notes: 'Prise légèrement plus large que les épaules, coudes hauts' },
  { id: '32', name: 'Oiseau (haltères)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=ttvADAPAjYA', notes: 'Buste incliné, coudes légèrement fléchis' },
  // Bras
  { id: '33', name: 'Curl biceps (barre)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo', notes: 'Coudes fixes, contraction en haut' },
  { id: '34', name: 'Curl biceps (haltères)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=sAq_ocpRh_I', notes: 'Alterner ou simultané, supination en haut' },
  { id: '35', name: 'Curl marteau (haltères)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4', notes: 'Prise neutre (pouce vers le haut)' },
  { id: '36', name: 'Curl câble (poulie basse)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=NFzTWp2qpiE', notes: 'Tension constante, coudes fixes' },
  { id: '37', name: 'Machine curl biceps', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=mPMkGEXVxgQ', notes: 'Bien caler les bras sur le coussin' },
  { id: '38', name: 'Extension triceps (câble, corde)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=-Vyt2QdsR7E', notes: 'Coudes près du corps, extension complète' },
  { id: '39', name: 'Extension triceps (câble, barre droite)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=6SS6K3lAwZ8', notes: 'Coudes immobiles, poignets neutres' },
  { id: '40', name: 'Dips triceps (banc)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=6kALZikXxLc', notes: 'Dos proche du banc, descendre jusqu\'à 90°' },
  { id: '41', name: 'Extension triceps couché (haltères)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM', notes: 'Coudes pointés vers le plafond, haltères près de la tête' },
  { id: '42', name: 'Machine triceps', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=Omx--JbVaq8', notes: 'Extension complète, coudes fixes' },
  // Abdominaux
  { id: '43', name: 'Crunchs', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=MKmrqcoCZ-M', notes: 'Soulevez les épaules, pas la tête entière' },
  { id: '44', name: 'Planche (gainage)', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw', notes: 'Corps aligné, ne pas laisser les hanches tomber' },
  { id: '45', name: 'Relevé de jambes (captain\'s chair)', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=Pr1ieGZ5ATk', notes: 'Contrôler la descente, ne pas se balancer' },
  { id: '46', name: 'Câble crunch (abdos)', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=2fbujeH3F0E', notes: 'Crunch vers les genoux, hanches fixes' },
  { id: '47', name: 'Russian twist (lest)', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI', notes: 'Dos droit, rotation depuis le buste' },
  // Cardio/Fonctionnel
  { id: '48', name: 'Rowing machine (ergomètre)', category: 'Cardio', youtubeUrl: 'https://www.youtube.com/watch?v=H0r_9cYFdSA', notes: 'Jambes puis dos puis bras à la traction' },
  { id: '49', name: 'Vélo elliptique', category: 'Cardio', youtubeUrl: 'https://www.youtube.com/watch?v=ge3e2fHCB_I', notes: 'Tenir les poignées mobiles, dos droit' },
  { id: '50', name: 'Battle ropes', category: 'Cardio', youtubeUrl: 'https://www.youtube.com/watch?v=7bKXS5RvUiY', notes: 'Genoux fléchis, alternance rapide des bras' },
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
  // Mise à jour auto si c'était encore le mini sample initial (≤6 exos)
  if (!stored || stored.length <= 6) {
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

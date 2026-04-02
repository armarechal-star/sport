// Simple localStorage-based store

const EXERCISES_VERSION = 3 // Incrémenter pour forcer la mise à jour des exercices par défaut

const KEYS = {
  exercises: 'wt_exercises',
  exercisesVersion: 'wt_exercises_version',
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

  // --- 100 exercices supplémentaires ---

  // Poitrine – machines & bodyweight
  { id: '51', name: 'Développé couché décliné (barre)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=LfyQBUKR8SE', notes: 'Tête plus basse que les hanches, cibler le bas pectoraux' },
  { id: '52', name: 'Écarté haltères couché (flyes)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0', notes: 'Légère flexion des coudes, grande amplitude' },
  { id: '53', name: 'Écarté câble incliné (haut pec)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=Iwe6AmxVf7o', notes: 'Poulies basses, mains rejoignent en haut' },
  { id: '54', name: 'Pompes (push-up)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4', notes: 'Corps gainé, coudes à 45°, descendre la poitrine au sol' },
  { id: '55', name: 'Pompes inclinées (pieds surélevés)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=PKGBeXfOGb0', notes: 'Pieds sur un banc, cibler le haut pectoraux' },
  { id: '56', name: 'Pompes déclinées (mains surélevées)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=jWxvty2KROs', notes: 'Mains sur un banc, cibler le bas pectoraux' },
  { id: '57', name: 'Pompes diamant (triceps + pec)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=J0DXoz-GJu4', notes: 'Mains en triangle sous la poitrine, coudes serrés' },

  // Dos – machines & bodyweight
  { id: '58', name: 'Soulevé de terre roumain (barre)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=hCDzSR6bW10', notes: 'Dos plat, descente le long des jambes, étirer les ischios' },
  { id: '59', name: 'Soulevé de terre roumain (haltères)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=jEy_czb3RKA', notes: 'Pieds hip-width, haltères glissent le long des jambes' },
  { id: '60', name: 'Face pull (câble corde)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk', notes: 'Poulie haute, tirer vers le visage, coudes en hauteur' },
  { id: '61', name: 'Tirage vertical prise serrée (câble)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=PfsPmEBEkEQ', notes: 'Prise à la largeur des épaules, tirer vers le sternum' },
  { id: '62', name: 'Machine iso-lateral tirage dos', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=4BqAFPt8XCQ', notes: 'Travailler bras par bras pour corriger les déséquilibres' },
  { id: '63', name: 'Tractions australiennes (inverted row)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=dvkIaarnf0g', notes: 'Corps planche, barre à hauteur de hanche, tirer la poitrine' },
  { id: '64', name: 'Superman (lombaires sol)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=z6PJMT2y8GQ', notes: 'Allongé ventre, soulever bras et jambes simultanément' },
  { id: '65', name: 'Machine pull-over', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=F3CJ4bFRFXo', notes: 'Étirer au maximum en haut, contracter le grand dorsal en bas' },
  { id: '66', name: 'Shrugs barre (trapèzes)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=cJRVVxmytaM', notes: 'Monter les épaules vers les oreilles, pause en haut' },
  { id: '67', name: 'Shrugs haltères (trapèzes)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=g6qbq4Lf1FI', notes: 'Mouvement vertical pur, ne pas rouler les épaules' },

  // Jambes – machines & bodyweight
  { id: '68', name: 'Squat hack (machine)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=0tn5K9NlCfo', notes: 'Pieds plus avancés pour cibler les fessiers' },
  { id: '69', name: 'Bulgarian split squat (haltères)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE', notes: 'Pied arrière surélevé, genou avant à 90°' },
  { id: '70', name: 'Step-up (banc, haltères)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=WCFCdxzFBa4', notes: 'Poser tout le pied sur le banc, pousser à travers le talon' },
  { id: '71', name: 'Glute kickback (machine)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=EDmFBH2YKEM', notes: 'Ne pas cambrer excessivement, contracter le fessier en haut' },
  { id: '72', name: 'Squat sumo (barre)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=QKKZ9AGYTi4', notes: 'Pieds très écartés, pointes vers l\'extérieur, cibler les adducteurs' },
  { id: '73', name: 'Fentes marchées (haltères)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=L8fvypPrzzs', notes: 'Alterner les jambes en avançant, tronc vertical' },
  { id: '74', name: 'Mollets debout (machine)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=gwLzBJYoWlI', notes: 'Amplitude complète, pause étirée en bas' },
  { id: '75', name: 'Glute bridge (sol, poids corps)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=wPM8icPu6H8', notes: 'Pousser les talons dans le sol, serrer les fessiers en haut' },
  { id: '76', name: 'Wall sit (isométrique)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=-cdph8hv0O0', notes: 'Dos plaqué au mur, cuisses parallèles au sol' },
  { id: '77', name: 'Pistol squat (squat unipodal)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=qDcniqddTeE', notes: 'Jambe libre tendue devant, descente contrôlée' },
  { id: '78', name: 'Nordic curl (ischio sol)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=Tgak2aIHFpU', notes: 'Chevilles bloquées, descente lente en contrôlant avec les ischios' },
  { id: '79', name: 'Goblet squat (haltère)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=MeIiIdhvXT4', notes: 'Haltère contre la poitrine, coudes entre les genoux en bas' },

  // Épaules – machines & câbles
  { id: '80', name: 'Élévations latérales (câble)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=PPf_CSgRn0Y', notes: 'Tension constante vs haltères, câble derrière le dos' },
  { id: '81', name: 'Élévations frontales (câble)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=gkrOBMVKFyM', notes: 'Poulie basse, tension continue sur le deltoïde antérieur' },
  { id: '82', name: 'Machine élévations latérales', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo', notes: 'Régler le siège, coudes légèrement fléchis' },
  { id: '83', name: 'Arnold press (haltères)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=6Z15_WdXmVw', notes: 'Rotation des paumes de l\'intérieur vers l\'extérieur pendant la montée' },
  { id: '84', name: 'Oiseau câble (rear delt)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=ttvADAPAjYA', notes: 'Poulies hautes croisées, tirer en écartant les bras' },
  { id: '85', name: 'Reverse pec deck (deltoïde post.)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=wN1HEn0TiEc', notes: 'Écarter les bras vers l\'arrière en gardant les coudes fléchis' },
  { id: '86', name: 'W-raise haltères (coiffeur)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=ttvADAPAjYA', notes: 'Buste incliné, coudes à 90°, soulever les avant-bras' },

  // Bras – machines & variantes
  { id: '87', name: 'Curl incliné (haltères)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=soxrZlIl35U', notes: 'Dos au banc incliné à 60°, coudes derrière le buste pour étirer le biceps' },
  { id: '88', name: 'Curl concentré (haltère)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=0AUGkch3tzc', notes: 'Coude contre la cuisse, supination complète en haut' },
  { id: '89', name: 'Curl Scott (banc larry)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=OkiswgALRhk', notes: 'Appuyer les bras sur le coussin, pas d\'élan possible' },
  { id: '90', name: 'Curl câble prise haute (stretch)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=NFzTWp2qpiE', notes: 'Poulie haute, tirer vers la nuque pour maximiser l\'étirement' },
  { id: '91', name: 'Extension triceps haltère (1 bras)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=_gsUck-7M74', notes: 'Coude pointé au plafond, baisser l\'haltère dans le dos' },
  { id: '92', name: 'Extension triceps câble (poulie haute)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=kiuVA0gs3EI', notes: 'Corps légèrement incliné, coudes fixes, extension complète' },
  { id: '93', name: 'Skull crushers barre EZ', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM', notes: 'Couché, baisser la barre vers le front, coudes fixes' },
  { id: '94', name: 'Close-grip bench press', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=nEF0bEWANhg', notes: 'Prise serrée (épaules), coudes serrés, triceps prioritaires' },
  { id: '95', name: 'Kickback triceps (haltère)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=6SS6K3lAwZ8', notes: 'Coude fixe, extension complète à l\'horizontale' },
  { id: '96', name: 'Reverse curl (bras)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=nkNHRzTFJRA', notes: 'Prise pronation (dos de main vers le haut), travaille le brachioradial' },

  // Abdos – poids du corps & câble
  { id: '97',  name: 'Bicycle crunch', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8', notes: 'Coude vers genou opposé, alterner lentement' },
  { id: '98',  name: 'Hollow body hold', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=5HoqhTTFj6o', notes: 'Bas du dos plaqué au sol, jambes tendues, tenir la position' },
  { id: '99',  name: 'Ab wheel rollout', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=rq2gIG4Pthk', notes: 'À genoux, rouler lentement sans cambrer, revenir avec les abdos' },
  { id: '100', name: 'Woodchopper câble (obliques)', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=pAplQXzYJxQ', notes: 'Rotation du buste, bras tendus, mouvement diagonal haut-bas' },
  { id: '101', name: 'Dead bug', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=4XLEnwUr1d8', notes: 'Dos plaqué au sol, alterner bras/jambe opposés lentement' },
  { id: '102', name: 'Toe touch (crunch jambes tendues)', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=nbBLUvUHBqE', notes: 'Jambes à la verticale, toucher les orteils avec les mains' },
  { id: '103', name: 'Pallof press (câble anti-rotation)', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=AH_QZLm_0-s', notes: 'Tenir la position, résister à la rotation, gainage total' },

  // Poids du corps / Fonctionnel
  { id: '104', name: 'Tractions (prise supination, chin-up)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=sIirogA4EPg', notes: 'Prise paumes vers soi, plus facile, plus biceps' },
  { id: '105', name: 'Tractions prise neutre', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=JKdSMCHnMCo', notes: 'Mains en face à face, moins de sollicitation des coudes' },
  { id: '106', name: 'Pike push-up (épaules)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=sposDXWEB0A', notes: 'Fesses en l\'air, tête vers le sol, simule le développé militaire' },
  { id: '107', name: 'Dips parallèles (poids du corps)', category: 'Bras', youtubeUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As', notes: 'Corps vertical, coudes serrés, pour les triceps' },
  { id: '108', name: 'Burpees', category: 'Cardio', youtubeUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU', notes: 'Enchainer squat, pompe et saut, rythme soutenu' },
  { id: '109', name: 'Jump squat (saut)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=CVaEhXotL7M', notes: 'Descendre à 90°, exploser vers le haut, amortir la réception' },
  { id: '110', name: 'Box jump (saut sur box)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=52r_Ul5k03g', notes: 'Balancer les bras, atterrir pieds à plat sur la box' },
  { id: '111', name: 'Mountain climbers', category: 'Cardio', youtubeUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM', notes: 'Position de pompe, ramener les genoux vers la poitrine en alternance' },
  { id: '112', name: 'High knees', category: 'Cardio', youtubeUrl: 'https://www.youtube.com/watch?v=OAJ_J3EZkdY', notes: 'Courir sur place en montant haut les genoux, bras actifs' },
  { id: '113', name: 'Inchworm (mobilité)', category: 'Autre', youtubeUrl: 'https://www.youtube.com/watch?v=Slng0CQBzFI', notes: 'Marcher avec les mains jusqu\'à la position de pompe et revenir' },
  { id: '114', name: 'Bear crawl', category: 'Autre', youtubeUrl: 'https://www.youtube.com/watch?v=S2sGBaI7xpE', notes: 'Avancer sur 4 appuis, genoux à 2 cm du sol, dos plat' },
  { id: '115', name: 'Renegade row (haltères)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=Bqs23EZgwBE', notes: 'Position de pompe sur haltères, tirer un bras sans rouler les hanches' },

  // Cardio machine
  { id: '116', name: 'Tapis roulant (course)', category: 'Cardio', youtubeUrl: 'https://www.youtube.com/watch?v=_kGESn8ArrU', notes: 'Tête droite, bras à 90°, ne pas tenir les barres' },
  { id: '117', name: 'Vélo stationnaire', category: 'Cardio', youtubeUrl: 'https://www.youtube.com/watch?v=ge3e2fHCB_I', notes: 'Selle à hauteur de hanche, cadence régulière' },
  { id: '118', name: 'Corde à sauter', category: 'Cardio', youtubeUrl: 'https://www.youtube.com/watch?v=FJmRQ5iTXKE', notes: 'Sauts légers, poignets qui tournent, corps gainé' },
  { id: '119', name: 'Stepper (machine escalier)', category: 'Cardio', youtubeUrl: 'https://www.youtube.com/watch?v=AvBwSdgLt3E', notes: 'Ne pas s\'appuyer sur les barres, descente contrôlée' },

  // Mobilité & gainage
  { id: '120', name: 'Planche latérale (gainage)', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=K2KACm2pHiA', notes: 'Corps aligné, hanche ne doit pas tomber, tenir la position' },
  { id: '121', name: 'Bird dog (gainage)', category: 'Abdos', youtubeUrl: 'https://www.youtube.com/watch?v=wiFNA3sqjCA', notes: 'À 4 pattes, étendre bras et jambe opposés, dos plat' },
  { id: '122', name: 'Copenhagen plank (adducteurs)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=dHBKMGwz-OI', notes: 'Pied posé sur un banc, lever la hanche, tenir' },
  { id: '123', name: 'Farmer\'s carry (portés)', category: 'Autre', youtubeUrl: 'https://www.youtube.com/watch?v=rt17lmnaLSM', notes: 'Marcher avec charges lourdes, épaules en arrière, gainage total' },
  { id: '124', name: 'Turkish get-up (haltère)', category: 'Autre', youtubeUrl: 'https://www.youtube.com/watch?v=0bR6PoHVfzA', notes: 'Mouvement complet du sol debout, bras tendu en permanence' },
  { id: '125', name: 'Landmine press (barre)', category: 'Épaules', youtubeUrl: 'https://www.youtube.com/watch?v=5pD_TjkMBvY', notes: 'Barre dans un angle, pousser en diagonale, bon pour les épaules fragiles' },
  { id: '126', name: 'Kettlebell swing', category: 'Autre', youtubeUrl: 'https://www.youtube.com/watch?v=YSxHifyI6s8', notes: 'Poussée des hanches explosive, bras passifs, dos plat' },
  { id: '127', name: 'Slam ball (médecine ball)', category: 'Cardio', youtubeUrl: 'https://www.youtube.com/watch?v=L1-GtAqhXVE', notes: 'Lever au-dessus de la tête, jeter au sol avec force' },
  { id: '128', name: 'TRX row (sangles)', category: 'Dos', youtubeUrl: 'https://www.youtube.com/watch?v=dvkIaarnf0g', notes: 'Corps incliné, tirer la poitrine vers les poignées, coudes en arrière' },
  { id: '129', name: 'TRX push-up (sangles)', category: 'Poitrine', youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4', notes: 'Instabilité accrue, gainage renforcé, amplitude contrôlée' },
  { id: '130', name: 'TRX squat (sangles)', category: 'Jambes', youtubeUrl: 'https://www.youtube.com/watch?v=UBhimrJxAkA', notes: 'Tenir les sangles pour l\'équilibre, descendre profond' },
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
  const storedVersion = load(KEYS.exercisesVersion, 0)
  const stored = load(KEYS.exercises, null)
  if (!stored || storedVersion < EXERCISES_VERSION) {
    // Garder les exercices perso (id non numérique) et ajouter les 50 par défaut
    const custom = stored ? stored.filter(e => isNaN(Number(e.id))) : []
    const merged = [...SAMPLE_EXERCISES, ...custom]
    save(KEYS.exercises, merged)
    save(KEYS.exercisesVersion, EXERCISES_VERSION)
    return merged
  }
  return stored
}

export function saveExercises(list) {
  save(KEYS.exercises, list)
}

export function resetExercises() {
  save(KEYS.exercises, SAMPLE_EXERCISES)
  save(KEYS.exercisesVersion, EXERCISES_VERSION)
  return SAMPLE_EXERCISES
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

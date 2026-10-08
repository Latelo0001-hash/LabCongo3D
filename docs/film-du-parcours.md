# Film du parcours — prototype du 7 octobre 2026

Demande : présenter la suite du voyage comme dans la vidéo de référence partagée par l’utilisateur (site de logistique « Every leg of the journey ») : de la vidéo réelle et des engins réalistes qui bougent au défilement, sans photos fixes.

## Séquence actuelle

Le film **ouvre l’accueil** dans `Home.tsx` et remplace l’ancien bloc `ImmersiveJourney`, retiré du code le 8 octobre 2026. Il est suivi de `JourneyAccess`, des contenus « Le projet en détail » et du CTA. Un progrès unique 0 → 1 pilote caméra, objets, textes et vidéos ; `filmTimeline.ts` l’exprime en **15,8 écrans de défilement**. La piste mesure 16,8 hauteurs d’écran, dont une occupée par la scène fixe.

| Chapitre | Début, en écrans | Contenu et raccord |
| --- | --- | --- |
| Récolte | 0 | Plan filmé au laboratoire ; l’erlenmeyer du chariot devient la fiole 3D |
| Matériel | 1 | Fiole, microscope, bécher, balance et éprouvette se rassemblent |
| Assemblage | 3,2 | Vérification, descente des objets dans la caisse, fermeture du couvercle |
| Conteneur | 4,9 | Entrée de la caisse, fermeture des portes, levage du conteneur |
| Route | 6,9 | Chargement sur la remorque, départ du camion, virage et montée de caméra |
| Navire | 11,6 | Vue aérienne : la route s’ouvre sur la vidéo du pont du navire |
| Traversée | 13,4 | Vidéo du porte-conteneurs en mer |
| Arrivée | 15 | Carte de la RDC et tracé schématique jusqu’à l’embouchure |

Les vidéos suivent le défilement dans les deux sens. La séquence de la récolte se charge à l’approche du film ; les deux vidéos maritimes et la carte se chargent après les modèles. Le film se trouvant en tête de page, l’approche correspond désormais à l’ouverture de l’accueil.

Lecture simple, mouvements réduits, petit écran en paysage ou absence de WebGL : huit chapitres sous forme de textes et d’images fixes. Les images couvrent la récolte, le port et les navires ; certains chapitres de cette lecture restent uniquement textuels. Les erreurs de modèle ou la perte du contexte WebGL déclenchent aussi cette version.

## Récolte filmée et raccord avec la 3D

Le 8 octobre 2026, l’utilisateur a fourni une **séquence générée** de 10 s (`labcongo.MP4`). Seul son premier plan est conservé, à sa demande : l’équipe et le personnel d’un laboratoire en Europe, autour d’un chariot (1,9 s). Les personnes à l’écran sont noires, comme l’a demandé l’utilisateur ; les futurs plans d’école montreront des élèves, sans image de pauvreté. Deux vidéos libres essayées avant elle (un enfant en expérience à la maison, une classe rurale) ont été écartées.

- Le plan passe sous le premier titre. Son temps suit le défilement de façon linéaire (`openingTime`).
- À 0,92 écran, la fiole 3D prend la place de l’erlenmeyer posé sur le chariot, à la même position et à la même hauteur. Ensuite, elle rejoint la collecte pendant que la vidéo s’efface ; le microscope monte après elle.
- La fiole de `labware-v2.glb` a été affinée (erlenmeyer haut et étroit) pour épouser la silhouette filmée.
- Les repères de l’erlenmeyer (`flask`) ont été mesurés entre 1 et 1,85 s, où il reste immobile. En cas de nouvelle vidéo, ils doivent être mesurés à nouveau.
- Le calcul tient compte du cadrage de la vidéo (`openingFrame`), partagé avec la scène 3D. Sur un écran en hauteur, le plan se resserre en bandeau juste au-dessus des commandes, dont la position est mesurée : la fiole reste visible au raccord.
- Un masque marine (`--ink`) assombrit la vidéo seulement côté texte et en bas de l’écran (à la verticale sur téléphone) ; le reste de l’image reste net, à pleine opacité. Il s’allège pour le raccord.
- Le son et les sous-titres de la séquence ne sont pas conservés.

## Affichage sur téléphone et navigation

- Les huit chapitres occupent deux lignes de quatre boutons sous 480 px. Les commandes « Passer le film » et « Lecture simple » ont une ligne distincte. Les cibles de chapitre mesurent au moins 44 px de haut.
- Les crédits restent accessibles dans un volet « Images d’illustration · Crédits », utilisable au clavier. Le panneau s’ouvre au-dessus des commandes et son contenu défile si nécessaire.
- Un fond sombre stabilise le contraste des commandes sur les différentes scènes. Un voile supplémentaire derrière les textes de l’ouverture améliore leur lecture sur téléphone, puis disparaît avant le décor clair du chargement.
- La liste de matériel affiche l’élément actif sur les écrans étroits ; les étapes de préparation se répartissent sur deux colonnes. Les petites hauteurs masquent ces indications secondaires pour laisser la place au texte.
- Un clic de chapitre atteint le titre après son fondu d’entrée. Le défilement libre conserve les transitions et les mouvements existants.

## Fichiers de référence

| Fichier | Responsabilité |
| --- | --- |
| `src/features/film/FilmSequence.tsx` | Vidéos, textes, navigation, crédits et modes de lecture |
| `src/features/film/FilmCanvas.tsx` | Atelier, engins, articulations, route et caméra |
| `src/features/film/filmTimeline.ts` | Huit étapes, temporalité, trajectoire et fonds |
| `src/features/film/useFilm.ts` | Progrès partagé et suivi du défilement |
| `src/features/film/film.css` | Composition, contrôles et adaptations mobiles |
| `src/features/film/sceneAssets.ts` | Microscope, caisse et conteneur : chargement et matériaux |
| `src/features/film/useRoomEnvironment.ts` | Reflets calculés localement, sans image HDR externe |
| `src/features/film/home.css` | En-tête transparent de l’accueil, bloc d’accès et contenus détaillés |
| `src/features/film/JourneyAccess.tsx` | Accès au projet et aux pages publiques |

## Médias et licences

Images d’illustration : elles ne montrent pas des actions de LabCongo. Les crédits sont affichés dans la séquence.

| Fichier | Source | Licence |
| --- | --- | --- |
| `public/media/parcours/recolte.mp4` (0 à 1,9 s, premier plan) | Séquence générée, fournie par l’utilisateur le 8 octobre 2026 (`labcongo.MP4`, 1920 × 1080) ; son et sous-titres retirés ; encodée en pleine résolution (CRF 16, légère accentuation) | Signalée comme générée dans les crédits |
| `public/media/parcours/navire-pont.mp4` (11 à 26 s de l’original) | [Pexels 26893765](https://www.pexels.com/video/aerial-view-of-containers-stacked-on-a-ship-26893765/), K | Licence Pexels |
| `public/media/parcours/navire-mer.mp4` (4 à 24 s) | [Pexels 2943126](https://www.pexels.com/video/aerial-footage-of-a-cargo-ship-at-sea-loaded-with-containers-2943126/), Alexander Bobrov | Licence Pexels |
| `public/media/parcours/port-grues.mp4` (0 à 10 s, réservé à la suite) | [Pexels 6595356](https://www.pexels.com/video/bird-s-eye-view-of-docked-container-ship-6595356/), K | Licence Pexels |
| `public/models/immersive/scania-truck.glb` | [« Scania truck »](https://sketchfab.com/3d-models/scania-truck-59889032d0ad457c81d7e058c79eedf8), PAndras | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `public/models/immersive/container-chassis-v2.glb` | Géométrie originale, `npm run models:immersive -- container-chassis-v2` | — |
| `public/models/immersive/labware-v2.glb` | Verrerie et balance originales, fiole affinée le 8 octobre 2026, `npm run models:immersive -- labware-v2` | — |
| Microscope, caisse et conteneur | Géométries et texture de bois : [passe sur le réalisme](amelioration-realisme.md) | Voir la provenance du bois |
| Carte | `public/maps/rdc-provinces.json` (geoBoundaries, © OpenStreetMap) | ODbL 1.0 |

Modifications du camion : lumière, caméra et logo Scania retirés ; textures ramenées à 1024 px en JPEG ; maillage simplifié de moitié et compressé (gltfpack, Meshopt). L’original téléchargé par l’utilisateur reste hors dépôt (`scania_truck/`).

Encodage des vidéos : H.264 sans son, 1600 × 900 à 4 Mbit/s pour les plans pilotés au défilement, avec une image clé toutes les 6 images ; démarrage rapide. Les originaux Pexels ne sont pas conservés dans le dépôt.

Les vidéos de classe rurale africaine (32778876, TimePRO TV), de classe africaine (29430344, B. Aristotlè Guweh Jr) et d’expérience d’un élève (6208955, cottonbro studio), citées dans l’inventaire précédent, ne sont pas intégrées au film actuel. L’ouverture utilisait auparavant une vidéo de laboratoire avec des adultes (Pexels 32402606, TimePRO TV), remplacée le 8 octobre 2026 par la séquence générée de la récolte.

## Limites

Prototype à examiner : rythme, cadrages et textes restent à valider. Essais faits dans le navigateur intégré (rendu WebGL logiciel), à refaire sur appareils réels et sur Safari. Les trois vidéos utilisées représentent environ **21,3 Mo** (récolte : 3,1 Mo ; pont : 8,1 Mo ; mer : 10,1 Mo). Les six GLB représentent environ **3,6 Mo**. Une version vidéo allégée pour mobile reste à prévoir. Le module JavaScript de scène atteint environ 997 Ko minifié / 267 Ko gzip, avec l’avertissement de taille Vite.

Le récit s’arrête à la carte de la RDC : la livraison à l’école, l’installation et l’apprentissage restent à réaliser. Les médias sont des illustrations, pas une preuve de livraison. Les formulaires et les pages publiques restent indépendants ; le back-end et l’administration sont différés.


## Vérification

Passe d’affichage mobile du 7 octobre 2026 :

- `npm run build` : réussi, avec l’avertissement de poids du module Three.js décrit plus haut.
- `npm run lint` et `git diff --check` : réussis.
- Chrome pour macOS, rendu WebGL logiciel, version compilée : huit chapitres parcourus à **1440 × 900, 820 × 1180, 390 × 844 et 320 × 568**. Titres visibles après navigation directe ; commandes dans l’écran, sans chevauchement entre elles ; aucun débordement horizontal.
- Crédits ouverts et fermés au clavier sur les quatre formats. Le panneau reste au-dessus des commandes et dans l’écran.
- Lecture simple et préférence de mouvements réduits : huit chapitres présents. Aucun canvas ni vidéo dans le mode à mouvements réduits.
- Premier chapitre contrôlé à nouveau après l’ajustement sous le logo, à 320 × 568 et 820 × 1180.
- Aucune erreur JavaScript observée pendant ce parcours. Les contrôles ne constituent pas un audit complet des performances ou de toutes les erreurs réseau.

[Résultats](validation/film-mobile-controles.json) · [Téléphone 390 px](validation/film-mobile-390.png) · [Téléphone 320 px](validation/film-mobile-320.png) · [Crédits ouverts](validation/film-mobile-credits.png) · [Premier chapitre](validation/film-mobile-intro.png).

Passe de l’ouverture du 8 octobre 2026 :

- `npm run build`, `npm run lint` et `git diff --check` : réussis.
- Chrome pour macOS, rendu WebGL logiciel, version compilée, à **1440 × 900** (0,3 ; 0,8 ; 0,92 ; 1,02 ; 1,15 ; 1,45 écran) et **390 × 844** (0,3 ; 0,8 ; 0,92 ; 1,05 ; 1,45). Au raccord, la fiole 3D recouvre l’erlenmeyer filmé (même base, même hauteur, largeur proche) ; sur téléphone, le plan se resserre en bandeau au-dessus des commandes.
- Aucune erreur JavaScript observée.

[Ordinateur](validation/ouverture-raccord-ordinateur.jpg) · [Téléphone](validation/ouverture-raccord-telephone.jpg).

Les essais sur Safari et sur téléphones physiques restent à effectuer avant publication. Ces passes ne comportent aucun déploiement.

# Film du parcours — prototype du 7 octobre 2026

Demande : présenter la suite du voyage comme dans la vidéo de référence partagée par l’utilisateur (site de logistique « Every leg of the journey ») : de la vidéo réelle et des engins réalistes qui bougent au défilement, sans photos fixes.

## Séquence actuelle

Le film **ouvre l’accueil** dans `Home.tsx` et remplace l’ancien bloc `ImmersiveJourney`, retiré du code le 8 octobre 2026. Il est suivi de `JourneyAccess`, des contenus « Le projet en détail » et du CTA. Un progrès unique 0 → 1 pilote caméra, objets, textes et vidéos ; `filmTimeline.ts` l’exprime en **12,92 écrans de défilement** (route resserrée le 9 octobre 2026 : 0,6 écran de profil, 0,8 pour le virage et 0,6 après, au lieu de 3,65 en tout). La piste mesure 13,92 hauteurs d’écran, dont une occupée par la scène fixe.

| Chapitre | Début, en écrans | Contenu et raccord |
| --- | --- | --- |
| Récolte | 0 | Un enfant fait une expérience de chimie ; la bouteille qu’il lève devient le flacon 3D |
| Matériel | 1 | Flacon, microscope, bécher, balance et éprouvette se rassemblent |
| Assemblage | 3,2 | Vérification, descente des objets dans la caisse, fermeture du couvercle |
| Conteneur | 4,9 | Entrée de la caisse, fermeture des portes, levage du conteneur |
| Route | 6,9 | Chargement sur la remorque, départ du camion, virage et montée de caméra |
| Navire | 8,92 | Vue aérienne : la route s’ouvre sur la vidéo du pont du navire |
| Traversée | 10,52 | Vidéo du porte-conteneurs en mer |
| Arrivée | 12,12 | Carte de la RDC et tracé schématique jusqu’à l’embouchure |

Les vidéos suivent le défilement dans les deux sens. La séquence de la récolte se charge à l’approche du film ; les deux vidéos maritimes et la carte se chargent après les modèles. Le film se trouvant en tête de page, l’approche correspond désormais à l’ouverture de l’accueil.

Lecture simple, mouvements réduits, petit écran en paysage ou absence de WebGL : huit chapitres sous forme de textes et d’images fixes. Les images couvrent la récolte, le port et les navires ; certains chapitres de cette lecture restent uniquement textuels. Les erreurs de modèle ou la perte du contexte WebGL déclenchent aussi cette version.

## Ouverture filmée et raccord avec la 3D

Depuis le 12 octobre 2026, à la demande de l’utilisateur, le film s’ouvre de nouveau sur l’enfant qui fait une expérience de chimie, lunettes de protection et gants (deux plans de RDNE Stock project, Pexels). Les essais précédents sont écartés : une classe rurale, puis le premier plan d’une séquence générée fournie par l’utilisateur (une équipe dans un laboratoire).

- Le plan A (il verse une solution dans une bouteille, 0 à 5 s) passe sous le premier titre. À 0,6 écran, le plan B le montre levant la bouteille vers la caméra.
- Le temps de la vidéo suit le défilement de façon linéaire, plan par plan (`openingTime`).
- À 0,9 écran, le flacon 3D prend la place de la bouteille filmée, à la même position et à la même taille. Ensuite, il rejoint la collecte pendant que la vidéo s’efface ; le microscope monte après lui.
- Le flacon de `labware-v2.glb` reprend les proportions de la bouteille filmée (col court, pour rester sous le gant). Il remplace l’erlenmeyer.
- Les repères de la bouteille (`bottle`) ont été mesurés sur le plan B à 1 s. En cas de nouvelle vidéo, ils doivent être mesurés à nouveau.
- Le calcul tient compte du cadrage de la vidéo (`openingFrame`), partagé avec la scène 3D. Sur les écrans étroits, le cadrage suit le visage de l’enfant au plan A, puis la bouteille au plan B ; le changement tombe sur la coupe. Sur un écran en hauteur, la vidéo se resserre en bandeau juste au-dessus des commandes, dont la position est mesurée : la bouteille entière reste visible au raccord.
- Un masque marine (`--ink`) assombrit la vidéo seulement côté texte et en bas de l’écran (à la verticale sur téléphone) ; le reste de l’image reste net, à pleine opacité. Il s’allège pour le raccord.
- Une courte volute de fumée filmée accompagne le raccord (`openingSmoke`, `TransitionSmoke.tsx`). Elle apparaît à 0,78 écran, reste légère au raccord (opacité du calque limitée à 48 %), puis disparaît avant 1,12 écran. Le fond noir est retiré par fusion « screen », avec des bords fondus ; la fumée reste localisée autour du flacon, sous les textes et les commandes. L’extrait de 1,6 seconde suit le défilement dans les deux sens, sans boucle ni lecture automatique. Il ne se charge pas en lecture simple ou avec les mouvements réduits. Une erreur de chargement le masque.

## Message d’accueil (12 octobre 2026)

Le premier écran porte un message d’accueil distinct des chapitres du film (`HeroCopy` dans `FilmSequence.tsx`) : repère « LabCongo · ASBL créée à Kinshasa », titre principal de la page avec « un autre horizon » en jaune, phrase de mission reprise de la présentation, et deux actions (« Découvrir le projet », qui mène au bloc d’accès sous le film, et « Soutenir LabCongo »).

- Le message s’efface à 0,34 écran (`hero.to`). Le premier chapitre prend ensuite le relais : « 01 / Europe · La récolte », titré « Tout commence en Europe. » **Ce titre est une proposition à valider.**
- À l’ouverture, la barre des chapitres laisse la place à l’invitation « Faites défiler » ; « Lecture simple » et les crédits restent accessibles. La barre revient dès 0,12 écran (`hero.cue`).
- Au chargement, le trait jaune se dessine et chaque ligne monte à son tour. Ces animations sont coupées avec la préférence de mouvements réduits.
- Sur téléphone, le message est en bas de l’écran, sous le visage de l’enfant ; le voile du haut n’arrive qu’avec le premier chapitre.
- La lecture simple affiche le même message avant les huit chapitres.

## Affichage sur téléphone et navigation

- Sous 1000 px, la barre tient sur une ligne : « Passer le film », le chapitre en cours (« 01 / 08 · Récolte ») et « Lecture simple ». Le chapitre en cours ouvre la liste des huit étapes au-dessus de la barre ; choisir une étape la referme. Les cibles mesurent au moins 44 px de haut.
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
| `src/features/film/TransitionSmoke.tsx` | Fumée du raccord entre la vidéo d’ouverture et la scène 3D |
| `src/features/film/sceneAssets.ts` | Microscope, caisse et conteneur : chargement et matériaux |
| `src/features/film/useRoomEnvironment.ts` | Reflets calculés localement, sans image HDR externe |
| `src/features/film/home.css` | En-tête transparent de l’accueil, bloc d’accès et contenus détaillés |
| `src/features/film/JourneyAccess.tsx` | Accès au projet et aux pages publiques |

## Médias et licences

Images d’illustration : elles ne montrent pas des actions de LabCongo. Les crédits sont affichés dans la séquence.

| Fichier | Source | Licence |
| --- | --- | --- |
| `public/media/parcours/ouverture.mp4` (0 à 5 s, puis 0 à 2,5 s du second plan ; version `-900` sous 1000 px) | [Pexels 7605349](https://www.pexels.com/video/a-boy-doing-a-science-project-7605349/) et [Pexels 7605361](https://www.pexels.com/video/chemistry-project-7605361/), RDNE Stock project ; le second plan, disponible en 1280 × 720 seulement, est agrandi | Licence Pexels |
| `public/media/parcours/fumee.mp4` (6 à 7,6 s, 960 × 540, H.264 sans son, 40 images / 141 Ko) | [Pexels 4490626](https://www.pexels.com/video/dark-pattern-texture-abstract-4490626/), Engin Akyurt ; désaturation et réglage du noir pour la fusion | [Licence Pexels](https://www.pexels.com/license/) |
| `public/media/parcours/navire-pont.mp4` (0 à 14 s, pivoté d’un demi-tour pour que la proue pointe vers le bas) | [Pixabay 23215](https://pixabay.com/videos/container-ship-transport-logistics-23215/), bellergy, original 3840 × 2160 | Licence Pixabay |
| `public/media/parcours/navire-mer.mp4` (4 à 24 s, depuis la version 2560 × 1440) | [Pexels 2943126](https://www.pexels.com/video/aerial-footage-of-a-cargo-ship-at-sea-loaded-with-containers-2943126/), Alexander Bobrov | Licence Pexels |
| `public/media/parcours/port-grues.mp4` (0 à 10 s, réservé à la suite) | [Pexels 6595356](https://www.pexels.com/video/bird-s-eye-view-of-docked-container-ship-6595356/), K | Licence Pexels |
| `public/models/immersive/scania-truck.glb` | [« Scania truck »](https://sketchfab.com/3d-models/scania-truck-59889032d0ad457c81d7e058c79eedf8), PAndras | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `public/models/immersive/container-chassis-v2.glb` | Géométrie originale, `npm run models:immersive -- container-chassis-v2` | — |
| `public/models/immersive/labware-v2.glb` | Flacon, bécher, éprouvette et balance originaux, `npm run models:immersive -- labware-v2` | — |
| Microscope, caisse et conteneur | Géométries et texture de bois : [passe sur le réalisme](amelioration-realisme.md) | Voir la provenance du bois |
| Carte | `public/maps/rdc-provinces.json` (geoBoundaries, © OpenStreetMap) | ODbL 1.0 |

Modifications du camion : lumière, caméra et logo Scania retirés ; textures ramenées à 1024 px en JPEG ; maillage simplifié de moitié et compressé (gltfpack, Meshopt). L’original téléchargé par l’utilisateur reste hors dépôt (`scania_truck/`).

Encodage des vidéos (9 octobre 2026) : H.264 sans son, 1920 × 1080 à environ 7 Mbit/s pour les navires, avec une image clé toutes les 12 images ; versions `-900` (1600 × 900) servies sous 1000 px. Le plan du pont (travelling le long d’un navire à quai, pendant le chargement) est pivoté pour que le navire, proue en bas, prolonge la route vue du ciel : il est centré à 48,5 % de la largeur (`deckLane` dans `filmTimeline.ts`), et la caméra comme le masque s’alignent sur ce couloir. Le plan de la récolte vient de l’export HD fourni par l’utilisateur (`Labcongo_HD_facile_a_telecharger.mp4`, mêmes images que `labcongo.MP4`), encodé en CRF 16. Les originaux Pexels ne sont pas conservés dans le dépôt.

Les vidéos de classe rurale africaine (32778876, TimePRO TV), de classe africaine (29430344, B. Aristotlè Guweh Jr) et d’expérience d’un élève (6208955, cottonbro studio), citées dans l’inventaire précédent, ne sont pas intégrées au film actuel. L’ouverture utilisait auparavant une vidéo de laboratoire avec des adultes (Pexels 32402606, TimePRO TV), remplacée le 8 octobre 2026 ; l’ouverture actuelle date du 12 octobre 2026.

## Limites

Prototype à examiner : rythme, cadrages et textes restent à valider. Essais faits dans le navigateur intégré (rendu WebGL logiciel), à refaire sur appareils réels et sur Safari. Les trois vidéos du film représentent environ **39,3 Mo** en 1080p (ouverture : 8,3 Mo ; pont : 12,9 Mo ; mer : 18,2 Mo) et **21,4 Mo** en version 900p, servie sous 1000 px (3,9 Mo ; 7,4 Mo ; 10,1 Mo). Les six GLB représentent environ **3,6 Mo**. Le module JavaScript de scène atteint environ 997 Ko minifié / 267 Ko gzip, avec l’avertissement de taille Vite.

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

Passe de l’ouverture du 12 octobre 2026 (retour à la vidéo de l’enfant) :

- `npm run build`, `npm run lint` et `git diff --check` : réussis.
- Chrome pour macOS, rendu WebGL logiciel, version compilée, à **1440 × 900** (0,3 ; 0,75 ; 0,9 ; 0,97 ; 1,1 ; 1,45 écran, version 1080p chargée) et **390 × 844** (0,3 ; 0,75 ; 0,9 ; 1,05 ; 1,45, version 900p chargée). Au raccord, le flacon 3D recouvre la bouteille filmée ; sur téléphone, la bouteille entière reste visible dans le bandeau au-dessus des commandes.
- Aucune erreur JavaScript observée.

[Ordinateur](validation/ouverture-raccord-ordinateur.jpg) · [Téléphone](validation/ouverture-raccord-telephone.jpg).

Passe du message d’accueil du 12 octobre 2026 :

- `npm run build`, `npm run lint` et `git diff --check` : réussis.
- Chrome pour macOS, rendu WebGL logiciel, version compilée, à **1440 × 900**, **1920 × 1080** et **390 × 844** : message d’accueil à gauche du visage sur ordinateur, sous le visage sur téléphone ; relais par le premier chapitre ; barre compacte et liste des étapes ouverte sur téléphone ; lecture simple avec le même message.
- Aucune erreur JavaScript observée.

[Accueil sur ordinateur](validation/hero-ordinateur.jpg) · [Accueil sur téléphone](validation/hero-telephone.jpg).

Les essais sur Safari et sur téléphones physiques restent à effectuer avant publication. Ces passes ne comportent aucun déploiement.


## Fumée filmée — vérification du 13 octobre 2026

Le raccord utilise désormais l’extrait filmé d’Engin Akyurt indiqué dans les crédits et le tableau des médias. Les volutes restent localisées autour du col de la bouteille ; les bords du calque se fondent dans l’image.

- Compilation de production (`npm run build`), lint et `git diff --check` réussis. L’avertissement Vite sur le module Three.js reste présent.
- Chrome, rendu WebGL logiciel : ordinateur 1440 × 900 et téléphone simulé 390 × 844. Apparition, dissipation, retour en arrière et absence de débordement horizontal vérifiés.
- Défilement rapide suivi d’un saut hors du raccord : fumée invisible ; retour au raccord : temps vidéo resynchronisé.
- Préférence de mouvements réduits : lecture simple, huit chapitres, aucun calque de fumée. Une erreur vidéo simulée masque l’effet sans interrompre le film.
- Extrait local décodé intégralement avec FFmpeg : 40 images, 1,6 seconde, 141 Ko, sans piste audio.

[Ordinateur](validation/raccord-fumee-reelle-ordinateur.jpg) · [Téléphone](validation/raccord-fumee-reelle-telephone.jpg). Ces contrôles sont effectués dans Chrome ; le rendu sur Safari et appareils physiques reste à vérifier.

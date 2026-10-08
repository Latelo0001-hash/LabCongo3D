# Reprise de l’accueil immersif — 7 octobre 2026

> Archive de la version précédente. L’accueil actuel utilise le [film en huit étapes](film-du-parcours.md). Les vérifications ci-dessous portent sur l’ancien accueil à cinq scènes.

La référence fournie dans `/Users/latelo01/Downloads/index.html` fixe le principe visuel : une scène persistante, de grands titres, des objets animés au défilement et des fonds qui évoluent. Ce principe est maintenant intégré au projet React existant, avec le logo fourni et les couleurs LabCongo. Les coordonnées fictives et le script Three.js ancien du fichier de référence n’ont pas été repris.

> Mise à jour : la [passe sur le réalisme des objets et décors](amelioration-realisme.md) remplace les modèles initiaux, ajoute des matériaux et affine l’éclairage. Le périmètre reste de cinq chapitres.

## Ce qui peut être examiné

L’accueil `/` contient les **cinq premières étapes** demandées dans le cahier de reprise : Europe → laboratoire → matériel → conditionnement → conteneur. Il s’agit d’un prototype de composition et de continuité des objets. Le récit complet jusqu’aux élèves reste à développer dans cette nouvelle mise en scène.

Un microscope accompagne les trois premiers chapitres, descend dans une caisse, puis la caisse entre dans le conteneur dont les portes se ferment. Les transformations se jouent dans les deux sens au défilement. Les cinq commandes permettent d’atteindre directement chaque étape et fonctionnent au clavier.

Les personnes et les lieux apparaissent dans les illustrations du pack média. Ils ne sont pas animés. L’entrée physique de la caméra par la porte du laboratoire, les gestes humains, la traversée maritime et l’arrivée dans l’école ne sont pas réalisés dans ce prototype.

## Fichiers

> Le code de cette version a été retiré le 8 octobre 2026 : le film du parcours le remplace. Les cinq fichiers de `src/features/immersive/` restent consultables dans l’historique git, au commit `64cbf4a`. Les styles encore utilisés (en-tête de l’accueil, bloc d’accès, contenus détaillés) sont dans `src/features/film/home.css`.

| Fichier | Rôle |
| --- | --- |
| `src/features/immersive/ImmersiveJourney.tsx` | Scène persistante, textes, navigation, lecture simple, accès aux pages |
| `src/features/immersive/timeline.ts` | Chapitres, illustrations, modèles, couleurs et repères de caméra |
| `src/features/immersive/useJourney.ts` | Progrès unique 0–1, synchronisation du défilement, accès aux chapitres |
| `src/features/immersive/JourneyCanvas.tsx` | Canvas R3F, microscope, caisse ouverte, conteneur et transitions |
| `src/features/immersive/immersive.css` | Composition responsive et styles limités à cette expérience |
| `src/pages/Home/Home.tsx` | Nouvel ordre de l’accueil et métadonnées préservées |
| `src/pages/Home/HomeDetails.tsx` | Ouverture des contenus détaillés et gestion des anciennes ancres |
| `src/pages/Home/DetailedHome.tsx` | Sections éditoriales précédentes, chargées à l’ouverture |
| `src/components/layout/Header.tsx` | Variante blanche du logo et présentation transparente sur l’accueil |
| `src/components/layout/PageLayout.tsx` | Activation de cette variante sur `/` seulement |

Les sections éditoriales restent disponibles dans « Le projet en détail ». Le CTA existant reste après celles-ci. Le composant de l’ancien hero est conservé dans les sources, mais n’est plus rendu sur l’accueil. Les routes publiques, la carte, les catalogues, les formulaires et le parcours photographique `/experience` sont conservés.

## Défilement et caméra

La piste mesure `600svh`, dont une hauteur d’écran occupée par la scène. Le progrès vaut 0 au début et 1 quand la dernière étape est cadrée. Les chapitres sont centrés sur les repères suivants ; une interpolation lissée assure les transitions.

| Progrès | Chapitre | Caméra : position → cible | FOV |
| --- | --- | --- | --- |
| 0 | Europe | `[0, 0.25, 8.4]` → `[0, 0, 0]` | 38° |
| 0.25 | Laboratoire | `[0, 0.4, 8.1]` → `[0, 0, 0]` | 38° |
| 0.50 | Matériel | `[0, 0.15, 7.8]` → `[0, 0, 0]` | 38° |
| 0.75 | Caisse | `[0, 2.4, 8.8]` → `[0, 0.15, 0]` | 39° |
| 1 | Conteneur | `[0, 0.6, 9.3]` → `[0, 0, 0]` | 39° |

Repères des gestes : apparition de la caisse 0.53–0.67 ; réduction et descente du microscope 0.57–0.82 ; fermeture du couvercle 0.80–0.86 ; arrivée du conteneur 0.79–0.88 ; entrée de la caisse 0.84–0.95 ; fermeture des portes 0.955–1.

Sur les écrans de moins de 1000 px de large, l’objet est recentré au-dessus du texte. Les petits écrans en paysage, les préférences de mouvements réduits, l’absence de WebGL et les erreurs de chargement utilisent la lecture simple. Le bouton « Lecture simple » reste disponible dans la scène animée.

## Médias et limites de réalisme

- Le microscope binoculaire et le conteneur détaillé sont désormais dans `/models/immersive/`. Les modèles initiaux restent archivés ; les versions actuelles restent des géométries illustratives, non des scans.
- La caisse utilise désormais `/models/immersive/crate-v2.glb`, avec couvercle animé, texture de bois, poignées, vis et calage.
- Cinq copies WebP de 1280 px sont dans `public/media/experience/web/` : Europe, laboratoire, matériel, conditionnement et chargement. Total : environ **424 Ko**. Les PNG maîtres restent intacts.
- Les images sont des illustrations générées avec personnages et lieux fictifs, signalées dans l’interface. Elles ne sont pas utilisées comme preuves d’interventions réalisées.
- Aucune vidéo ni prestation externe payante n’est nécessaire à ce prototype. Aucun nouveau média IA n’a été généré pendant cette reprise.

Correspondances des copies WebP :

| WebP | Source du pack |
| --- | --- |
| `europe.webp` | `01-europe-arrival/reference-v2.png` |
| `laboratoire.webp` | `02-laboratory-entry/reference-v1.png` |
| `materiel.webp` | `05-equipment-closeup/reference-v2.png` |
| `conditionnement.webp` | `06-equipment-packing/reference-v1.png` |
| `chargement.webp` | `08-container-loading/reference-v1.png` |

## Performances

Un seul canvas, trois GLB compressés, rendu à la demande, densité plafonnée à 1,5 et aucune animation autonome. La passe de réalisme ajoute une lumière d’environnement calculée localement et des ombres sur une carte de 1024 px. Le progrès inchangé ne déclenche pas un nouveau rendu, notamment sous la scène. Le moteur 3D est chargé par import différé uniquement en mode animé ; les sections éditoriales sont également différées.

La compilation produit un module de scène d’environ 990 Ko minifié, 265 Ko gzip. Vite signale sa taille ; ce poids reste un axe d’optimisation avant publication. Les mesures visuelles et les contrôles de rendu ont lieu dans Chrome automatisé avec rendu logiciel ; ils ne constituent pas une mesure de fluidité sur un téléphone réel.

## Suite

Examiner la composition, le rythme et les raccords de ces cinq scènes, puis préciser la finition des objets. Étendre ensuite le même moteur au camion, au port, au navire, à la réception en RDC, à l’école, à l’installation et à l’apprentissage. Les séquences humaines plus réalistes pourront être intégrées au fur et à mesure des médias disponibles.

Le projet reste local. Aucun déploiement, ajout de données de terrain, modification de serveur ou modification du site PHP historique n’a été effectué.

## Vérifications effectuées le 7 octobre

- `npm run build` : réussi. Avertissement conservé sur la taille du module Three.js, décrit ci-dessus.
- `npm run lint` : réussi.
- Chrome automatisé, version compilée : 17 contrôles réussis. Navigation aux cinq chapitres au clavier ; défilement réel ; conservation du même canvas ; absence de dessin WebGL au repos ; lecture simple puis retour au chapitre courant ; sortie du récit ; ouverture des sections détaillées ; ancienne ancre `#collecte` ; pages équipements, don, expérience et contact ; retour à l’accueil ; absence d’erreur JavaScript pendant la navigation normale.
- Formats examinés : 1440 × 900, 820 × 1180, 390 × 844, 320 × 568 et 844 × 390. Aucun débordement horizontal constaté. Un dernier contrôle visuel des étapes 1, 4 et 5 a confirmé le cadrage des objets après recentrage du conteneur sur mobile.
- Mouvements réduits : les cinq scènes restent accessibles, sans téléchargement du moteur 3D ni des GLB.
- WebGL absent, chargement du microscope refusé et perte du contexte simulés : bascule vers la lecture simple.

Résultats détaillés : [contrôles du navigateur](validation/accueil-controles.json). Captures : [ordinateur](validation/accueil-ordinateur.png), [petit téléphone](validation/accueil-mobile.png), [conteneur sur téléphone](validation/accueil-conteneur-mobile.png).

Les contrôles ont été exécutés sur Chrome pour macOS avec rendu WebGL logiciel. Un essai sur appareils physiques et sur Safari reste à prévoir avant publication.

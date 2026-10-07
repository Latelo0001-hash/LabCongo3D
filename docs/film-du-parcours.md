# Film du parcours — prototype du 7 octobre 2026

Demande : présenter la suite du voyage comme dans la vidéo de référence partagée par l’utilisateur (site de logistique « Every leg of the journey ») : de la vidéo réelle et des engins réalistes qui bougent au défilement, sans photos fixes.

## Séquence

Placée sur l’accueil juste après les cinq chapitres immersifs (`src/features/film/`). Un seul progrès 0 → 1 pilote tout (`filmTimeline.ts`) :

| Progrès | Plan |
| --- | --- |
| 0 – 0,12 | De profil, le conteneur descend sur la remorque du camion |
| 0,12 – 0,36 | Le camion part vers la droite ; les étapes défilent dans la route |
| 0,34 – 0,50 | La caméra s’élève à la verticale pendant que l’attelage prend le virage |
| 0,50 – 0,62 | Vue du ciel, la route s’ouvre sur le pont d’un porte-conteneurs filmé par drone |
| 0,56 – 0,76 | Le pont du navire défile, piloté image par image par le défilement |
| 0,72 – 0,93 | Recul du drone au-dessus de l’océan |
| 0,87 – 1 | Carte de la RDC et tracé schématique depuis le nord |

Les vidéos sont pilotées au défilement dans les deux sens. Elles ne se chargent qu’une fois la scène 3D prête, elle-même chargée à l’approche de la séquence. Lecture simple, mouvements réduits ou absence de WebGL : version fixe avec images et textes.

## Médias et licences

Images d’illustration : elles ne montrent pas des actions de LabCongo. Les crédits sont affichés dans la séquence.

| Fichier | Source | Licence |
| --- | --- | --- |
| `public/media/parcours/navire-pont.mp4` (11 à 26 s de l’original) | [Pexels 26893765](https://www.pexels.com/video/aerial-view-of-containers-stacked-on-a-ship-26893765/), K | Licence Pexels |
| `public/media/parcours/navire-mer.mp4` (4 à 24 s) | [Pexels 2943126](https://www.pexels.com/video/aerial-footage-of-a-cargo-ship-at-sea-loaded-with-containers-2943126/), Alexander Bobrov | Licence Pexels |
| `public/media/parcours/port-grues.mp4` (0 à 10 s, réservé à la suite) | [Pexels 6595356](https://www.pexels.com/video/bird-s-eye-view-of-docked-container-ship-6595356/), K | Licence Pexels |
| `public/models/immersive/scania-truck.glb` | [« Scania truck »](https://sketchfab.com/3d-models/scania-truck-59889032d0ad457c81d7e058c79eedf8), PAndras | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `public/models/immersive/container-chassis-v2.glb` | Géométrie originale, `npm run models:immersive -- container-chassis-v2` | — |
| Carte | `public/maps/rdc-provinces.json` (geoBoundaries, © OpenStreetMap) | ODbL 1.0 |

Modifications du camion : lumière, caméra et logo Scania retirés ; textures ramenées à 1024 px en JPEG ; maillage simplifié de moitié et compressé (gltfpack, Meshopt). L’original téléchargé par l’utilisateur reste hors dépôt (`scania_truck/`).

Encodage des vidéos : H.264 sans son, 1600 × 900 à 4 Mbit/s pour les plans pilotés au défilement, avec une image clé toutes les 6 images ; démarrage rapide. Les originaux Pexels ne sont pas conservés dans le dépôt.

Quatre autres vidéos Pexels sont téléchargées pour les scènes suivantes, pas encore intégrées : laboratoire (32402606, TimePRO TV), classe rurale africaine (32778876, TimePRO TV), classe africaine (29430344, B. Aristotlè Guweh Jr), expérience d’un élève (6208955, cottonbro studio).

## Limites

Prototype à examiner : rythme, cadrages et textes restent à valider. Essais faits dans le navigateur intégré (rendu WebGL logiciel), à refaire sur appareils réels et sur Safari. Les vidéos ajoutent environ 18 Mo, chargés seulement à l’approche ; une version allégée pour mobile reste à prévoir.

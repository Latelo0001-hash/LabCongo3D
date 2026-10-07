# Objets, matériaux et décors — passe du 7 octobre 2026

Priorité donnée par l’utilisateur : améliorer le réalisme des objets et des décors tout en conservant la scène au défilement validée.

## Modifications visibles

- **Microscope binoculaire** : bras courbé en émail ivoire, deux oculaires, objectifs avec bagues, platine percée, porte-lame, condenseur, molettes crantées, pieds, câble et prise. Le socle bleu-gris et les pièces noires reprennent la direction de l’image de référence. Les courbes reçoivent des normales lissées et les métaux des reflets d’environnement.
- **Caisse** : panneaux en bois avec veinage, renforts, vis, coins métalliques, poignées, repères de manutention, calage en mousse et couvercle séparé animé.
- **Conteneur** : tôle pliée, cadre, pièces de levage, joints, charnières, barres et poignées de verrouillage. Les deux portes conservent leurs pivots après compression.
- **Lumière** : reflets calculés localement à partir d’un environnement de pièce, lumière principale chaude et remplissage froid, ombres portées et sur les objets. Les anneaux décoratifs ont été retirés.
- **Décors** : illustrations existantes plus visibles et moins saturées ; fondus et léger rapprochement liés au progrès exact du défilement. Un voile sombre accompagne le côté du texte pour préserver sa lecture.

La navigation directe interrompt désormais l’inertie de Lenis, ce qui permet de conserver le bon chapitre après un défilement rapide ou un passage par la lecture simple.

## Sources et fichiers

Les géométries sont originales, générées par `scripts/generate-immersive-models.mjs`. Elles ne sont pas des scans photogrammétriques ni la reproduction certifiée d’un appareil commercial.

| Fichier | Taille approximative | Fonction |
| --- | --- | --- |
| `public/models/immersive/microscope-v2.glb` | 269 Kio | Instrument détaillé |
| `public/models/immersive/crate-v2.glb` | 126 Kio | Caisse avec nœud `CrateLid` |
| `public/models/immersive/container-v2.glb` | 313 Kio | Conteneur avec nœuds `DoorLeft` et `DoorRight` |
| `public/textures/immersive/*.webp` | 35 Kio au total | Couleur, normale et rugosité du bois |

La texture du bois vient de [Wood095 d’ambientCG](https://ambientcg.com/a/Wood095), distribué sous [CC0](https://docs.ambientcg.com/license/). Voir [la provenance et les conversions](../public/textures/immersive/README.md).

`gltfpack` 1.3.0 est ajouté comme dépendance de développement. `npm run models:immersive` produit les trois modèles compressés avec Meshopt. Les options conservent les noms des articulations et des matériaux, ainsi que les UV en virgule flottante : ces coordonnées doivent rester exactes puisque les textures sont affectées dans l’application. Le décodeur est fourni avec le module de scène, sans CDN.

Les matériaux sont affectés dans `src/features/immersive/sceneAssets.ts`, l’éclairage dans `StudioLighting.tsx`, et les gestes dans `JourneyCanvas.tsx`. Le registre `timeline.ts` pointe vers les nouveaux modèles. Les modèles précédents restent disponibles pour les anciens composants.

## Périmètre et limites

Les cinq chapitres et les pages existantes sont conservés. Les images de personnes et de lieux restent les illustrations générées précédemment, signalées dans l’interface. Il n’y a pas de nouveaux personnages 3D, de vidéo générée, ni de reportage réel ajouté.

Cette passe augmente le détail et la cohérence des objets ; le rendu reste une scénographie 3D illustrative. Les personnages ne se déplacent pas dans les images. La continuité spatiale complète entre les lieux et la suite du récit vers les écoles restent à réaliser.

Un seul canvas demeure actif, avec rendu à la demande et densité plafonnée à 1,5. La lumière d’environnement est calculée au montage ; les ombres utilisent une carte de 1024 px. Les trois modèles représentent environ 708 Kio au total. Le module JavaScript Three.js reste volumineux (environ 990 Ko minifié, 265 Ko gzip) et Vite le signale. Une vérification sur appareils physiques reste nécessaire avant publication.

## Vérification de cette version

- `npm run build` et `npm run lint` : réussis.
- Chargement des trois GLB compressés : géométries et coordonnées UV valides, articulations du couvercle et des deux portes conservées.
- **19 contrôles dans Chrome réussis**, sans erreur JavaScript pendant la navigation normale : cinq chapitres, clavier, défilement, routes existantes, accès aux sections détaillées, absence de rendu WebGL au repos, formats ordinateur / tablette / téléphone, lecture simple et cas de chargement indisponible.
- Contrôle final complémentaire : absence de titres superposés aux raccords, fermeture de la caisse puis chargement dans le conteneur, clic sur un chapitre pendant l’inertie du défilement, et retour au chapitre courant après la lecture simple.

Les tests utilisent Chrome sur macOS avec rendu WebGL logiciel et des fenêtres de 1440 × 900, 820 × 1180, 390 × 844, 320 × 568 et 844 × 390. Ils ne remplacent pas un essai sur Safari et sur appareils physiques.

[Résultats des 19 contrôles](validation/realisme-controles.json).

## Captures pour examen

- [Microscope sur ordinateur](validation/realisme-ordinateur.png)
- [Caisse ouverte et matériau bois](validation/realisme-caisse.png)
- [Entrée de la caisse dans le conteneur](validation/realisme-chargement.png)
- [Conteneur fermé](validation/realisme-conteneur.png)
- [Petit écran de téléphone](validation/realisme-mobile.png)

Les captures et ce bilan documentent une version locale ; aucune publication distante n’a été effectuée.

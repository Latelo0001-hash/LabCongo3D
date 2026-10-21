# Film du parcours — prototype du 7 octobre 2026, ouverture refaite le 15 octobre 2026

Demande : présenter la suite du voyage comme dans la vidéo de référence partagée par l’utilisateur (site de logistique « Every leg of the journey ») : de la vidéo réelle et des engins réalistes qui bougent au défilement, sans photos fixes.

## Séquence actuelle

Le film **ouvre l’accueil** dans `Home.tsx` et remplace l’ancien bloc `ImmersiveJourney`, retiré du code le 8 octobre 2026. Il est suivi de `JourneyAccess`, des contenus « Le projet en détail » et du CTA. Un progrès unique 0 → 1 pilote caméra, objets, textes et vidéos ; `filmTimeline.ts` l’exprime en **9,87 écrans de défilement** depuis le 15 octobre 2026 (11,87 auparavant : la collecte remplace la vidéo de l’enfant et l’atelier, et le film passe de huit à six chapitres). La piste mesure 10,87 hauteurs d’écran, dont une occupée par la scène fixe.

Rythme de la suite, inchangé depuis le 13 octobre 2026 : route resserrée (0,6 écran de profil, 0,8 pour le virage et 0,6 après), chapitre du navire de 0,9 écran (le plan du pont ne garde que ses 9,2 dernières secondes, lues sur 1,3 écran), fondu vers la mer quand la proue est entrée dans l’image, et départ de la caméra vers la route dès le début du levage du conteneur.

| Chapitre | Début, en écrans | Contenu et raccord |
| --- | --- | --- |
| Collecte | 0 | Salle de laboratoire (image générée) ; le matériel de la paillasse devient 3D, entre dans trois caisses qui se ferment |
| Conteneur | 2,6 | La photo s’efface, les caisses rejoignent la cour, entrent dans le conteneur, qui se ferme puis est hissé |
| Route | 4,55 | Chargement sur la remorque, départ du camion, virage et montée de caméra |
| Navire | 6,57 | Vue aérienne : la route s’ouvre sur la vidéo du pont du navire |
| Traversée | 7,47 | Vidéo du porte-conteneurs en mer |
| Arrivée | 9,07 | Carte de la RDC et tracé schématique jusqu’à l’embouchure |

Les vidéos suivent le défilement dans les deux sens. Les deux photos du laboratoire se chargent avec la page ; les deux vidéos maritimes et la carte se chargent après les modèles.

Lecture simple, mouvements réduits, petit écran en paysage ou absence de WebGL : six chapitres sous forme de textes et d’images fixes. Les images couvrent la collecte (la salle avec ses caisses), le port et les navires ; les chapitres du conteneur et de l’arrivée restent uniquement textuels. Depuis le 21 octobre 2026, une erreur de la scène 3D (modèle ou texture qui ne se charge pas, mémoire ou réseau d’un téléphone) ne déclenche plus cette version : en fin de parcours sur téléphone, le film passait de lui-même en lecture simple et la page sautait (remarque de l’utilisateur). Désormais la 3D se masque, la photo du laboratoire garde son matériel, les vidéos du navire et la carte se chargent quand même, et la scène est retentée après 4 s, 10 s, 25 s puis 1 min, cache des chargements vidé groupe par groupe (`clearSceneCache` dans `sceneAssets.ts`). La lecture simple ne s’ouvre plus que par son bouton ou d’emblée. Vérifié en bloquant le modèle du camion : le film reste en place à l’aller et au retour, et la 3D revient dès que le modèle se charge. Depuis le 14 octobre 2026, la perte du contexte WebGL, fréquente sur téléphone à court de mémoire, ne remplace plus le film : la scène 3D se masque jusqu’à ce que le navigateur rétablisse le contexte, et la page garde sa longueur. Auparavant, le film se raccourcissait de 10 862 à 4 050 px sous le doigt (390 × 844) : à l’aller, le défilement sautait la section suivante ; au retour, le film passait de lui-même en lecture simple. Vérifié par un aller-retour complet en gestes tactiles, avec et sans perte simulée du contexte : le film reste en place, sans erreur JavaScript.

## Ouverture filmée : la caméra recule jusqu'à la photo (16 et 20 octobre 2026)

À la demande de l'utilisateur, d'après le site d'Emons présenté dans le reel « Websites in 2026 » de wearebrand (capture qu'il a partagée) : ce qu'il voulait en reprendre, c'est la caméra qui parcourt les espaces, zoome et change d'angle. Une photo fixe ne permet que zooms et recadrages ; l'utilisateur a donc fourni des vidéos générées à partir de la photo du laboratoire (8 s, 24 images/s), où la caméra se déplace avec la profondeur réelle entre les paillasses.

- **Un seul plan** (20 octobre 2026) : `labo-salle.mp4`, le plan d'entrée dans la salle (`labcongo_camera_cinematique_8s_1080p.mp4`, qui part du cadre de la photo et avance un peu dans la salle) monté à l'envers. La page s'ouvre un peu à l'intérieur de la salle ; sous le message d'accueil, la caméra recule doucement jusqu'au cadre exact de la photo (dernière image superposée à `labo.jpg`, ressemblance 0,998), où la collecte commence. Vitesse rendue régulière (82 images choisies à pas de mouvement constant ; le plan d'origine marquait une quasi-pause au milieu). H.264, une image clé toutes les 8 images, sans images B : 2,3 Mo en 1080p, 1,6 Mo en 900p sous 1000 px. Sa première image (`labo-salle.jpg`, 0,27 Mo) sert d'affiche tant que la vidéo n'est pas chargée.
- **Versions précédentes**, retirées à la demande de l'utilisateur :
  - 16 octobre : quatre plans aller-retour (glissement, arc, orbite, hauteur), chacun revenant sur l'image de la photo, sur 2,1 écrans sans texte : attente trop longue, zooms répétés (`.claude/sauvegardes/traversee-aller-retour-2026-10-16/`) ;
  - 16 au 20 octobre : l'entrée dans la salle, puis, après un fondu, un gros plan sur le matériel de la paillasse de gauche et un recul jusqu'à la photo. Le passage au gros plan faisait un zoom brusque (`.claude/sauvegardes/traversee-2026-10-20/`). Les originaux restent dans les Téléchargements de l'utilisateur.
- **C'est le défilement qui conduit la caméra** (correction du 16 octobre 2026 : une première version faisait jouer les plans seuls en boucle). Le film s'ouvre sur une traversée filmée de 0,5 écran (`prelude` et `travelShots` dans `filmTimeline.ts`) : en haut de page, l'image est fixe, le message d'accueil s'efface au premier défilement pendant que la caméra recule. À 0, la caméra est sur la photo ; la collecte et toute la suite gardent leurs repères (le progrès 0 → 1 couvre désormais 10,73 écrans, sortie ralentie comprise). Le texte de la collecte commence à apparaître à -0,05 écran et se lit pleinement à 0,15 : du haut de la page à ce texte lisible, il y a 0,65 écran (1,22 le 16 octobre au soir, 2,6 avec les plans aller-retour ; l'utilisateur trouvait l'attente trop longue).
- **Raccords** : le plan est dans le calque de la photo (`.film-lab`), au même cadrage sur tous les écrans, sous le même masque et les mêmes motifs ; un fondu de 0,35 s efface le petit écart avec la photo à l'arrivée.
- Vérifié le 20 octobre : aucune lecture en haut de page (position 0 après 8 s) ; le plan suit le défilement dans les deux sens ; ordinateur et téléphone.
- La lecture simple et le mode « mouvements réduits » gardent la photo seule. Crédit : « Laboratoire : images et vidéo générées ».

## Sortie filmée : de la salle à la cour (16 et 20 octobre 2026)

À la demande de l'utilisateur, un dernier plan relie la collecte au chargement : les caisses fermées, on marche jusqu'à la porte du fond, ouverte sur la cour où attend le conteneur, on la franchit, et la lumière du dehors mène à la scène 3D du conteneur. L'utilisateur voulait « un déplacement normal, comme si on marchait avec la caméra », pas un zoom (16 octobre).

- **Sources** (vidéos générées par l'utilisateur, 1920 × 1080, 24 i/s, 8 s) :
  - `labcongo_walk_out_to_container_8s_1080p.mp4` : de l'image de la porte ouverte (cour, camion et conteneur bleu, pins), la caméra marche jusqu'au seuil. Plan continu, sans coupe, mais en trois élans séparés de quasi-arrêts. **Utilisée.**
  - `labcongo_walk_to_doors_container_8s_1080p.mp4` : **non utilisée**. Elle part de `labo-caisses.jpg` (ressemblance 0,999) au lieu de `depart-sortie-porte.jpg` : caisses ouvertes et vides, et matériel de retour sur les paillasses, alors que la collecte vient de tout ranger. Elle n'atteint pas la porte non plus : vers 6 s, elle se fond en surimpression dans l'image de fin, puis coupe à 6,7 s.
  - La première version (16 octobre, `labcongo_orbit_doors_bloom_10s.mp4`, montage de quatre plans, caisses ouvertes, panneaux blancs devant les portes) est remplacée ; son traitement est gardé dans `.claude/sauvegardes/outils-video/` (`labo-sortie-v1-2026-10-16.mp4`).
- **Raccord** : la photo de la salle ne montre les portes que sur 105 × 190 pixels ; la vidéo commence à deux mètres d'elles. Les relier par un zoom demanderait plus de 7× (image floue, et c'est le zoom que l'utilisateur a écarté) : un fondu de 0,1 écran, comme une coupe au cinéma, mène de la salle aux caisses fermées jusque devant les portes ; la marche commence pendant le fondu.
- **Traitement** (`sortie-cour.mjs` et la suite, dans `.claude/sauvegardes/outils-video/`) : la marche jusqu'au seuil (images 0 à 188), puis 44 images de plus où la caméra continue à travers l'encadrement vers le camion (poussée jusqu'à 2,4×, centrée sur le conteneur) pendant que la lumière du dehors gagne l'image jusqu'à la couleur du fond clair (233, 232, 228). Images intermédiaires à 72 i/s (`minterpolate`), puis 200 images à pas de mouvement constant (la lumière pèse 0,6 dans la mesure, pour que la marche garde 72 % du défilement). H.264, une image clé toutes les 8 images, sans images B : `labo-sortie.mp4` en 1080p (4,1 Mo) et `labo-sortie-900.mp4` (2,7 Mo) sous 1000 px.
- **Intégration** (`exitShot` dans `filmTimeline.ts`, de 2,3 à 2,95 écrans) : la vidéo est un calque plein écran de l'ouverture (`.film-exit`), sous le même masque, qui s'efface pendant la marche. Elle arrive en fondu pendant que les caisses 3D s'effacent ; la 3D ne se redessine pas tant que le plan couvre l'écran (`exitCovers`, `exitReady`), puis revient pendant la lumière : les caisses apparaissent dans la cour devant le conteneur. Le cadrage suit la porte, puis le conteneur (`--exit-x`, utile sur un écran en hauteur). Le texte du chargement arrive à 2,95 et le chapitre « Conteneur » commence à 2,9. Le plan se charge pendant la collecte ; s'il n'est pas prêt, la photo s'efface comme avant (`collect.fade`). Une fois sa première image chargée, il reste considéré comme prêt : à chaque saut, Safari repasse la vidéo aux seules métadonnées (`readyState` 1) ; tester `readyState` à chaque image faisait disparaître le plan sous Safari (image cassée après la mise en caisses, remarque de l'utilisateur du 16 octobre).
- **Ralenti** (21 octobre 2026, l'utilisateur trouvait la marche vers la porte trop rapide) : sur la plage de la sortie, le défilement avance 1,55 fois moins vite dans le film (`exitSlow` ; `at` et `progressAt` dans `filmTimeline.ts`) ; la suite du film garde ses repères et se trouve repoussée de 0,36 écran. La marche jusqu'au seuil prend 0,68 écran de défilement au lieu de 0,44. Pour que la sortie ne reste pas trop longtemps sans texte, « Prêt à partir » reste affiché pendant le fondu et le début de la marche (`captionsEnd`, 2,52). Sous 1000 px de large, le défilement au doigt traversait encore la marche trop vite (remarque de l'utilisateur, même jour) : le ralenti y passe à 2 (`exitPaces`, choisi par `FilmSequence` selon la largeur ; 2,5 était devenu trop lent), la marche prend 0,88 écran de défilement et « Prêt à partir » reste jusqu'à 2,64 ; le film y mesure 11,02 écrans (10,73 sur un écran large).
- **Vérifié** (Chrome sans écran) : déroulé sur ordinateur et téléphone ; boutons de chapitre (chacun arrive sur son texte) ; comportement de Safari simulé, sans disparition du plan ; plan bloqué, l'ancien fondu reprend. La fluidité n'a pas pu être mesurée le 20 octobre (machine très chargée : les mesures variaient du simple au double d'un essai à l'autre) ; à vérifier dans Safari et sur un vrai téléphone.

## Ouverture : la collecte dans la salle de laboratoire (15 octobre 2026)

À la demande de l’utilisateur, les chapitres de l’ouverture, du matériel et de l’assemblage fusionnent en « 01 / Europe · La collecte ». À l’ouverture, on voit une salle de laboratoire lumineuse ; au défilement, le matériel de la paillasse du premier plan entre dans des caisses qui se referment, puis le film enchaîne sur le conteneur.

- **Images** (`public/media/parcours/`) : `labo.jpg`, la salle avec son matériel (image générée par l’utilisateur avec ChatGPT, 1672 × 941) ; `labo-vide.jpg`, la même photo dont seule la paillasse du premier plan est reprise de sa version vidée (masque polygonal adouci de 10 px ; le tabouret de l’allée et tout le reste viennent de l’originale) ; `labo-caisses.jpg`, la version avec trois caisses ouvertes, qui sert de modèle à la 3D et d’image à la lecture simple. Les références générées restent hors du dépôt public (`../references-labo/`).
- **Mouvements de caméra sur la photo** (`labMoves` dans `filmTimeline.ts`, 15 octobre 2026, à la demande de l'utilisateur : « effets de zoom et jeux d'angles ») : ce ne sont que des recadrages de l'image (zoom et point visé), que la caméra 3D reprend exactement ; la photo ne permet pas de tourner autour. Sur un écran large : lente avancée sous le message d'accueil (×1,05), gros plan sur la paillasse quand le matériel 3D prend le relais (×1,15), recul pendant l'envol, puis avancée sur les caisses qui se ferment (×1,15). Sur un écran en hauteur, mêmes temps, zooms plus doux (×1,03 à ×1,1).
- **Angles autour du conteneur** (`loading` dans `CameraRig`) : une fois la photo effacée, la caméra tourne autour de la cour, d'un trois-quarts haut presque de face vers un trois-quarts plus bas, s'avance pendant l'entrée des caisses et recule à la fermeture des portes.
- **Caméra calée sur la photo** (`lab`, `labFocal`, `labPitch` dans `filmTimeline.ts`) : champ vertical de 50°, ligne d’horizon à 385 px, œil à 1,25 m, paillasse à 0,9 m. La caméra 3D reproduit le cadrage « cover » de l’image (`labFrame`, `setViewOffset`) : sur un écran étroit, le cadre suit d’abord la paillasse, puis glisse vers les caisses entre 0,6 et 1,6 écran, et la 3D suit.
- **Raccord** (`collect.swap`, 0,28 à 0,42 écran) : neuf objets 3D (`bench-equipment-v1.glb` : microscope, deux portoirs, erlenmeyers, bécher, pissette, lunettes) apparaissent à la place exacte de ceux de la photo, dont la paillasse passe à sa version vide. Chaque objet est posé par lancer de rayon depuis le pixel de sa base (`onLab`) et mis à la taille de sa hauteur à l’écran (`benchItems` dans `FilmCanvas.tsx`). Des ombres portées discrètes les posent sur la paillasse.
- **Caisses** : trois caisses 3D arrivent de derrière le spectateur et glissent jusqu’à l’allée, à la place de celles de `labo-caisses.jpg` (`crateSpots` : arête avant de la base et hauteur à l’écran ; `crateOnLab` en déduit la taille, dessus de la caisse compris). L’image générée n’a pas une perspective tout à fait régulière : chaque caisse garde la taille mesurée sur la photo, puis les trois prennent la même dans la cour. Les couvercles sont posés contre les caisses, comme sur l’image.
- **Collecte** (fenêtres de départ par table, `tables` dans `FilmCanvas.tsx`) : les objets se soulèvent un par un, passent au-dessus de leur caisse et y descendent. La paillasse du premier plan se vide d'abord par la gauche (0,75 à 1,75 écran), puis les autres tables partent par vagues intercalées jusqu'à 2 écrans. Le texte du chapitre s'efface juste avant, entre 0,85 et 1,05 écran (`collect.clear`), et le voile marine s'allège (`openingMask`, aussi sur téléphone) : le matériel en mouvement n'est plus caché par le texte ni assombri (signalé par l'utilisateur le 15 octobre 2026). Les étapes, en bas, accompagnent l'envol. Les couvercles se ferment entre 1,92 et 2,3 écrans, les quatre étapes (Identifier, Vérifier, Protéger, Conditionner) s’allument pendant ce temps.
- **Sous-titres de la mise en caisses** (20 octobre 2026, à la demande de l'utilisateur : « les séquences où les matériels entrent dans les caisses manquent des textes ») : de 1,1 à 2,5 écrans, trois sous-titres se succèdent en haut à gauche, au-dessus du matériel en vol, chacun lié à une étape (`stepStarts`, `captions` dans `filmTimeline.ts`) : « 02 · Vérifier — Chaque appareil est vérifié », « 03 · Protéger — Protégé pour le voyage », « 04 · Conditionner — Prêt à partir ». Les phrases reprennent la préparation décrite sur le site (`process` : vérifier le fonctionnement, inventorier, préparer le conditionnement pour le transport). Plus petits que les titres de chapitre ; leur voile ne couvre que le haut de l'écran, pour que le matériel reste dégagé. Les étapes du bas s'allument aux mêmes repères.
- **Passage au conteneur** : la sortie filmée (voir plus haut) couvre ce passage ; sans elle, la photo s’efface vers le fond clair entre 2,35 et 2,65 écrans pendant que la caméra recule (`collect.leave`, 2,42 à 3,05) ; les caisses rejoignent la cour, s’alignent devant le conteneur et y entrent l’une après l’autre. Sur un écran large, le conteneur se place à droite du texte du chapitre.
- Un masque marine (`--ink`) assombrit la photo côté texte et en bas de l’écran ; il s’allège après le message d’accueil. Le même masque est reporté sur la 3D (`LabGrade`, calcul partagé `openingMask`) : sans lui, le matériel resterait clair là où la photo s’assombrit.
- La vidéo de l’enfant (RDNE Stock project) n’est plus utilisée par le film ; ses fichiers `ouverture*.mp4` et `ouverture.jpg` restent dans le dépôt. Les essais précédents de l’ouverture (classe rurale, séquence générée, vidéo de l’enfant avec raccord flacon puis fumée) sont décrits dans l’historique Git.

### Matériel des autres tables (15 octobre 2026)

À la demande de l'utilisateur, le matériel des autres tables de la photo s'envole aussi dans les caisses : 23 objets de plus, sur la paillasse du milieu, celle de droite, le comptoir du fond à droite et le comptoir de droite au premier plan. Le comptoir sous les fenêtres, très loin et sous le texte, garde son matériel.

- **Photo vidée** : l'utilisateur a fourni une version de la photo aux tables vides (ChatGPT, rangée avec les autres références hors du dépôt). Elle se superpose à l'originale à moins d'un demi-pixel. Seules les zones des objets de ces tables, reflets compris, en sont reprises, ramenées à la teinte des alentours dans l'original (transfert de couleur Lab mesuré sur une couronne autour de chaque zone), bords fondus ; le reste de l'image vient de l'original, et la paillasse du premier plan garde sa version vidée précédente.
- **Modèles** : variantes des objets existants (erlenmeyers rouge et jaune, béchers jaune et bleu, flacon pulvérisateur, portoirs vide, jaune et à trois tubes) ; les objets en double sont des copies qui partagent maillages et matériaux. Le modèle passe à 470 Kio.
- **Calage** : chaque objet relevé sur la photo (bas de la silhouette, hauteur, orientation), vérifié en superposant la 3D seule, rendue à la taille exacte de l'image, à la photo. Au bord droit de l'image générée, la perspective est moins régulière : les repères du comptoir du premier plan sont corrigés d'après cette superposition.
- **Caisses** : le matériel du milieu va dans la caisse de gauche, celui de droite dans celle du milieu, celui du fond et du comptoir de droite dans celle de droite ; les objets sans place attribuée prennent une place libre au fond de la caisse.
- **Cadrage** : sur un écran large, le cadre glisse vers les tables de droite pendant leurs départs ; sur un écran en hauteur, il les suit aussi.
- **Ombres et reflets** : sur les tables proches seulement ; sur les tables lointaines, ils ne feraient que quelques pixels.
- **Coût** : rendu logiciel, 390 × 844, position fixe pendant la collecte : environ 670 ms par image contre 500 sans les autres tables. Ce rendu calcule tout sur le processeur ; une carte graphique de téléphone traite sans peine ces 120 000 triangles environ, à vérifier sur appareil.

### Réalisme du matériel (15 octobre 2026)

À la demande de l’utilisateur, le matériel 3D est refait pour ressembler à celui de la photo : couleurs franches, verre transparent, reflets sur la paillasse.

- **Modèles** (`labItems` dans `scripts/generate-immersive-models.mjs`), repris forme par forme en superposant la 3D seule (rendue sur fond magenta) à la photo, le même jour, à la demande de l'utilisateur (« certains matériels ont perdu leurs vraies formes ») :
  - microscope binoculaire vu de profil, comme sur la photo (le film le tourne d'un demi-tour) : socle peu profond, colonne blanche droite qui ne s'incurve qu'en haut, bloc noir derrière elle, platine et condenseur noirs, molettes crantées, revolver chromé à quatre objectifs, oculaires penchés vers la droite ;
  - portoirs à plateau percé et côtés ouverts (deux montants par bout) ;
  - erlenmeyer à la solution bleue, flacon à épaule pour l'eau claire (ce n'est pas un erlenmeyer), erlenmeyer vide au bord gauche ;
  - bécher et cinq agitateurs blancs en éventail, sans graduations ni cotons, absents de la photo ;
  - pissette au bouchon cranté ;
  - lunettes : écran à deux coques et échancrure du nez, bandeau bleu épais, montants bleus, attaches et sangle noires.
  Seconde passe, à la demande de l'utilisateur (« certains matériels cassent sur leur forme ») : chaque objet a été rendu seul sous quatre vues (face, trois-quarts plongeant, profil, normales) pour repérer les cassures. Corrigé : l'eau du flacon, invisible (un objet en transmission ne se voit pas au travers d'un autre ; elle est désormais translucide, et le verre n'écrit plus la profondeur) ; le bandeau des lunettes, fait de deux joncs, remplacé par une bande d'une pièce, avec attaches et sangle dans le prolongement de la monture ; le bloc noir du microscope, plaqué à côté de la potence, désormais dans son épaisseur ; les agitateurs, qui se croisaient ; les solutions des portoirs, qui affleuraient dans les trous du plateau ; la couture des objets tournés (verrerie, solutions, pissette), qui dessinait un trait au milieu des flacons vus au travers du verre et passe à l'arrière.
  339 Kio, 41 188 triangles.
- **Matériaux physiques** : verre et écran des lunettes en transmission (la photo reste visible au travers, avec des reflets nets), eau translucide ; émail et plastiques vernis ; solutions mates, à éclat propre et dégradé du fond vers la surface (couleurs de sommets). Solutions et verre échappent au tone mapping, qui délavait les couleurs vives.
- **Verre visible en vol** : devant la photo, le verre n'ajoutait que ses reflets ; un flacon soulevé devant le mur ou les meubles clairs perdait sa partie vide, et seule la solution restait visible (signalé par l'utilisateur). Le verre garde désormais un corps léger, plus dense sur les bords vus en biais, comme l'épaisseur du verre (`sharpTransmission`) : son contour reste lisible sur fond clair comme sur fond sombre.
- **Transmission sur canevas transparent** (`ClearTransmission`, `sharpTransmission` dans `FilmCanvas.tsx`) : three.js remplit le fond de son rendu de transmission en blanc à 50 % quand le canevas est transparent, ce qui rendait le verre laiteux ; ce fond reste transparent. Sur les objets fins, three.js ajoute la courbure à l’écran à la rugosité et floute l’image vue au travers du verre, ce qui diluait les solutions des tubes : la transmission garde ici la rugosité du verre. Ce rendu se fait à mi-résolution.
- **Calage** (`fitOnLab`) : chaque objet, orienté comme sur la photo, est posé par le bas de sa silhouette (arête avant de sa base) et mis à l’échelle d’après ses sommets, de façon que son point le plus haut à l’écran tombe sur celui de la photo, profondeur comprise. Pour les lunettes, le bas de la silhouette est celui des coques, en retrait du milieu de l'écran : leur repère est abaissé d'autant. Les positions horizontales ont été reprises objet par objet en superposant la 3D à la photo d’origine sous le même masque.
- **Reflets** : chaque objet a une copie retournée sous le plan de la paillasse, translucide, qui s’estompe sur 15 cm et quand l’objet s’élève ; un pochoir la limite au plateau (`benchTop`, écrit par le plan des ombres). Le verre n’y figure pas, les solutions si.
- **Photo vidée** : la paillasse reprise de l’image vidée était plus claire et plus bleue que l’originale, et le changement se voyait au raccord. Sa teinte est ramenée à celle du plateau d’origine (transfert de couleur Lab mesuré hors objets et hors reflets d’objets), en gardant ses reflets de fenêtres.
- **Compilation** : les matériaux (verre, solutions, reflets) sont compilés pendant l’écran de chargement, objets cachés compris, pour ne pas figer l’image à leur première apparition.
- **Coût mesuré** (Chrome, rendu WebGL logiciel, 390 × 844, à position fixe pendant la collecte) : la transmission ajoute environ 15 % au temps de rendu à mi-résolution (45 % à pleine résolution) ; les reflets et les ombres, presque rien. Le rendu logiciel ne donne pas de chiffres absolus représentatifs d’un téléphone : à vérifier sur appareil.

## Lisibilité des textes (16 octobre 2026)

À la demande de l'utilisateur, le fond s'assombrit chaque fois qu'un texte apparaît. Un voile bleu nuit (`.film-scrim`, dans `.film-scrims`) suit l'apparition et la disparition de chaque texte : le message d'accueil, les six chapitres et la bande des étapes de la route. Il est très sombre du côté du texte (dégradé depuis le coin haut gauche, la gauche, le bas gauche ou le centre, selon `place`) et assombrit un peu le reste de l'image (20 %). Sur téléphone, il descend du haut, ou monte du bas pour le message d'accueil et les textes du bas. Il remplace l'ancien voile du haut propre au téléphone (`--mobile-shade-opacity`).

- Tous les textes sont clairs : « Le chargement » et « La route », en texte sombre sur fond clair jusque-là, passent en blanc.
- Les étapes de la collecte et la bande de la route passent au-dessus des voiles (z-index 8).
- Les étapes de la collecte n'ont pas de voile : elles accompagnent l'envol du matériel, qui doit rester dégagé et lisible (remarque du 15 octobre) ; leur halo sombre suffit. Les sous-titres de la mise en caisses ont un voile limité au haut de l'écran, pour la même raison.

## Message d’accueil (12 octobre 2026)

Le premier écran porte un message d’accueil distinct des chapitres du film (`HeroCopy` dans `FilmSequence.tsx`) : repère « LabCongo · ASBL créée à Kinshasa », titre principal de la page avec « un autre horizon » en jaune, phrase de mission reprise de la présentation, et deux actions (« Découvrir le projet », qui mène au bloc d’accès sous le film, et « Soutenir LabCongo »).

- Le message s’efface à 0,34 écran (`hero.to`). Le premier chapitre prend ensuite le relais : « 01 / Europe · La collecte », titré « Tout commence en Europe. » **Ce titre est une proposition à valider.**
- À l’ouverture, la barre des chapitres laisse la place à l’invitation « Faites défiler » ; « Lecture simple » et les crédits restent accessibles. La barre revient dès 0,12 écran (`hero.cue`).
- Au chargement, le trait jaune se dessine et chaque ligne monte à son tour. Ces animations sont coupées avec la préférence de mouvements réduits.
- Sur téléphone, le message est en bas de l’écran, sous les fenêtres de la salle ; le voile du haut n’arrive qu’avec le premier chapitre.
- La lecture simple affiche le même message, sur la photo de la salle, avant les six chapitres.

## Affichage sur téléphone et navigation

- Sous 1000 px, la barre tient sur une ligne : « Passer le film », le chapitre en cours (« 01 / 06 · Collecte ») et « Lecture simple ». Le chapitre en cours ouvre la liste des six étapes au-dessus de la barre ; choisir une étape la referme. Les cibles mesurent au moins 44 px de haut.
- Les crédits restent accessibles dans un volet « Images d’illustration · Crédits », utilisable au clavier. Le panneau s’ouvre au-dessus des commandes et son contenu défile si nécessaire.
- Un fond sombre stabilise le contraste des commandes sur les différentes scènes. Un voile supplémentaire derrière les textes de l’ouverture améliore leur lecture sur téléphone, puis disparaît avant le décor clair du chargement.
- Les étapes de préparation se répartissent sur deux colonnes sur les écrans étroits ; une ombre portée les garde lisibles au-dessus des caisses claires. Les petites hauteurs masquent ces indications secondaires pour laisser la place au texte.
- Un clic de chapitre atteint le titre après son fondu d’entrée. Le défilement libre conserve les transitions et les mouvements existants.

## Fichiers de référence

| Fichier | Responsabilité |
| --- | --- |
| `src/features/film/FilmSequence.tsx` | Vidéos, textes, navigation, crédits et modes de lecture |
| `src/features/film/FilmCanvas.tsx` | Collecte calée sur la photo, engins, articulations, route et caméra |
| `src/features/film/filmTimeline.ts` | Six étapes, temporalité, calage de la photo, trajectoire et fonds |
| `src/features/film/useFilm.ts` | Progrès partagé et suivi du défilement |
| `src/features/film/film.css` | Composition, contrôles et adaptations mobiles |
| `src/features/film/sceneAssets.ts` | Caisse et conteneur : chargement et matériaux |
| `src/features/film/useRoomEnvironment.ts` | Reflets calculés localement, sans image HDR externe |
| `src/features/film/home.css` | En-tête transparent de l’accueil, bloc d’accès et contenus détaillés |
| `src/features/film/JourneyAccess.tsx` | Accès au projet et aux pages publiques |

## Médias et licences

Images d’illustration : elles ne montrent pas des actions de LabCongo. Les crédits sont affichés dans la séquence.

| Fichier | Source | Licence |
| --- | --- | --- |
| `public/media/parcours/labo.jpg`, `labo-vide.jpg` et `labo-caisses.jpg` (ouverture et collecte depuis le 15 octobre 2026 ; JPEG de 1672 × 941, 290 à 323 Ko) | Images générées par l’utilisateur avec ChatGPT ; la version vide est un montage des deux images (paillasse seule, teinte ramenée à celle de l’original) ; mention « Image d’illustration générée » | Images générées, sans personne ni marque |
| `public/models/immersive/bench-equipment-v1.glb` (339 Kio, 41 188 triangles depuis la passe de réalisme) | Matériel de la paillasse, géométrie originale d’après la photo, `npm run models:immersive -- bench-equipment-v1` | — |
| `public/media/parcours/ouverture.mp4` (plus utilisée par le film depuis le 15 octobre 2026 ; 0 à 5 s, puis 0 à 2,5 s du second plan ; version `-900` sous 1000 px) | [Pexels 7605349](https://www.pexels.com/video/a-boy-doing-a-science-project-7605349/) et [Pexels 7605361](https://www.pexels.com/video/chemistry-project-7605361/), RDNE Stock project ; le second plan, disponible en 1280 × 720 seulement, est agrandi | Licence Pexels |
| `public/media/parcours/navire-pont.mp4` (4,8 à 14 s depuis le 13 octobre 2026, des grues à la proue ; coupe sans ré-encodage, pivoté d’un demi-tour pour que la proue pointe vers le bas) | [Pixabay 23215](https://pixabay.com/videos/container-ship-transport-logistics-23215/), bellergy, original 3840 × 2160 | Licence Pixabay |
| `public/media/parcours/navire-mer.mp4` (4 à 24 s, depuis la version 2560 × 1440) | [Pexels 2943126](https://www.pexels.com/video/aerial-footage-of-a-cargo-ship-at-sea-loaded-with-containers-2943126/), Alexander Bobrov | Licence Pexels |
| `public/media/parcours/ecole.mp4` et `ecole.jpg` (section « À l’arrivée · L’école » de l’accueil, 8 à 31 s depuis le 14 octobre 2026 ; version `-900` de 4,6 Mo sous 1000 px, chargée à un écran de distance ; recadré en 16:9 et retourné en miroir pour que l’élève passe à droite, sous le texte) | [Pexels 6208955](https://www.pexels.com/video/student-doing-science-experiment-6208955/), cottonbro studio, original 4096 × 2160 | Licence Pexels |
| `public/media/parcours/port-grues.mp4` (0 à 10 s, réservé à la suite) | [Pexels 6595356](https://www.pexels.com/video/bird-s-eye-view-of-docked-container-ship-6595356/), K | Licence Pexels |
| `public/models/immersive/scania-truck.glb` | [« Scania truck »](https://sketchfab.com/3d-models/scania-truck-59889032d0ad457c81d7e058c79eedf8), PAndras | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `public/models/immersive/container-chassis-v2.glb` | Géométrie originale, `npm run models:immersive -- container-chassis-v2` | — |
| Caisse et conteneur | Géométries et texture de bois : [passe sur le réalisme](amelioration-realisme.md) ; `microscope-v2.glb` et `labware-v2.glb`, qui servaient à l’atelier, sont retirés le 15 octobre 2026 | Voir la provenance du bois |
| Carte | `public/maps/rdc-provinces.json` (geoBoundaries, © OpenStreetMap) | ODbL 1.0 |

Modifications du camion : lumière, caméra et logo Scania retirés ; textures ramenées à 1024 px en JPEG ; maillage simplifié de moitié et compressé (gltfpack, Meshopt). L’original téléchargé par l’utilisateur reste hors dépôt (`scania_truck/`).

Encodage des vidéos (9 octobre 2026) : H.264 sans son, 1920 × 1080 à environ 7 Mbit/s pour les navires, avec une image clé toutes les 12 images ; versions `-900` (1600 × 900) servies sous 1000 px. Le plan du pont (travelling le long d’un navire à quai, pendant le chargement) est pivoté pour que le navire, proue en bas, prolonge la route vue du ciel : il est centré à 48,5 % de la largeur (`deckLane` dans `filmTimeline.ts`), et la caméra comme le masque s’alignent sur ce couloir. Le plan de la récolte vient de l’export HD fourni par l’utilisateur (`Labcongo_HD_facile_a_telecharger.mp4`, mêmes images que `labcongo.MP4`), encodé en CRF 16. Les originaux Pexels ne sont pas conservés dans le dépôt.

Les vidéos de classe rurale africaine (32778876, TimePRO TV) et de classe africaine (29430344, B. Aristotlè Guweh Jr), citées dans l’inventaire précédent, ne sont pas intégrées au film actuel. L’expérience d’un élève (6208955, cottonbro studio) remplace depuis le 14 octobre 2026 la séquence générée de la section de l’école : la scène doit montrer des élèves des humanités, en section scientifique, et aucune vidéo libre ne montre une classe noire du secondaire au laboratoire. Encodage : H.264 sans son, 1920 × 1080, CRF 26, une image clé toutes les 12 images, 6,3 Mo pour 23 s. L’ouverture utilisait auparavant une vidéo de laboratoire avec des adultes (Pexels 32402606, TimePRO TV), remplacée le 8 octobre 2026 ; l’ouverture actuelle date du 12 octobre 2026.

## Limites

Prototype à examiner : rythme, cadrages et textes restent à valider. Essais faits dans le navigateur intégré (rendu WebGL logiciel), à refaire sur appareils réels et sur Safari. Les deux vidéos du film représentent environ **26 Mo** en 1080p (pont : 7,8 Mo ; mer : 18,2 Mo) et **14,6 Mo** en version 900p, servie sous 1000 px (4,5 Mo ; 10,1 Mo) ; les deux photos de l’ouverture, 0,6 Mo. Les cinq GLB représentent environ **3,5 Mo**. Le module JavaScript de scène atteint environ 997 Ko minifié / 267 Ko gzip, avec l’avertissement de taille Vite.

Transition des chapitres 7 et 8 (14 octobre 2026) : elle saccadait au point de se figer sur téléphone. Deux causes, mesurées sur 390 × 844 avec le processeur ralenti quatre fois : la scène 3D, déjà invisible, était redessinée à chaque mouvement du défilement ; la carte redessinait ses 39 655 points à chaque image de son agrandissement. Désormais, la scène 3D n'est redessinée et affichée qu'entre le raccord et le passage au navire (`sceneShown`, de 0,85 à 8,9 écrans ; de 0,26 à 6,9 depuis le 15 octobre 2026) ; les provinces sont allégées (6 385 points, voir `public/maps/README.md`) et dessinées une seule fois dans un canevas, que le navigateur met à l'échelle ; la route et le point d'arrivée restent en SVG, au même calage. Résultat : de 1,6 à 3,6 images par seconde à 31, et l'image la plus lente passe de 3 à 4 s à 83 ms. Carte identique à l'œil avant et après.

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

Passe de la collecte du 15 octobre 2026 :

- `tsc`, `npm run lint` et `vite build` : réussis.
- Chrome pour macOS, rendu WebGL logiciel, version compilée, à **1440 × 900** (de 0,2 à 9,6 écrans), **390 × 844**, **320 × 568** et **820 × 1180** : au raccord, les objets 3D recouvrent ceux de la photo (position et taille) ; les caisses 3D se superposent à celles de `labo-caisses.jpg` ; envols, fermeture, recul vers la cour, entrée dans le conteneur, puis route, navire, mer et carte aux nouveaux repères.
- Aller-retour (0,5 → 9,6 → 0,47 écran) : caisses et objets reviennent à leur place, sans erreur JavaScript. Lecture simple (mouvements réduits) : six chapitres, photo de la salle en tête.

Passe de réalisme du matériel du 15 octobre 2026 :

- `tsc`, `npm run lint`, `vite build` et `git diff --check` : réussis.
- Chrome pour macOS, rendu WebGL logiciel, cache du navigateur désactivé : la 3D comparée à la photo d’origine sous le même masque, à 0,45 écran, sur **1440 × 900** et **390 × 844** (positions, tailles, couleurs, transparence du verre, reflets) ; envols de 0,3 à 2,1 écrans ; film complet sur **390 × 844**, **320 × 568** et **820 × 1180**, avec retour en arrière. Aucune erreur JavaScript.

Les essais sur Safari et sur téléphones physiques restent à effectuer avant publication. Ces passes ne comportent aucun déploiement.

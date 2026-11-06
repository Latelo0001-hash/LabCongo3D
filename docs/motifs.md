# Motifs du thème — 14 octobre 2026

Deux motifs prolongent le film sur l’accueil : des instruments de laboratoire au trait fin et le fil du voyage. Ils sont dessinés en SVG dans le code (`src/components/motifs/`) : aucun fichier à télécharger, aucune illustration générée.

## Instruments

Six dessins au trait dans un carré de 48 unités : erlenmeyer, bécher gradué, éprouvette, microscope, balance, molécule. `MotifField` les dispose en petites constellations ; chaque jeu fixe la position (en % du cadre), la taille, la rotation et la profondeur de parallaxe de chaque instrument.

| Emplacement | Jeu | Particularités |
| --- | --- | --- |
| Message d’accueil du film (et lecture simple) | `hero` | Sur ordinateur, au-dessus et au-dessous du texte, côté masque ; ils glissent pendant que le message s’efface. Sous 1000 px, deux motifs seulement, à droite du titre. |
| « Faire une place à la pratique des sciences » (`#decouvrir`) | `access` | Autour de la présentation et de son image de laboratoire. |
| 01 — Pourquoi agir | `problem` | Section claire : traits bleus, accent rouge. |
| 02 — Notre réponse | `mission` | Coin haut droit et bas de la section. |
| 04 — Les effets attendus | `impact` | À côté du titre ; section blanche depuis le 14 octobre 2026 : traits bleus, accent rouge. |
| « Du matériel, du temps, une compétence à partager » (`#agir`) | `cta` | Constellation à droite, traversée par le fil du voyage. |

Traits blancs à 20 % d’opacité sur les sections bleues (30 % sur le message d’accueil), une molécule jaune en accent. Sous 760 px, les motifs marqués `wide` disparaissent et l’opacité baisse.

## Textures de fond

En CSS pur, aux couleurs de LabCongo. La trame de points reprend celle des sections de rarsm.org ; les ondes concentriques de ce site, essayées un temps, ont été retirées à la demande de l'utilisateur et remplacées par un réseau moléculaire, propre au thème :

| Texture | Où | Description |
| --- | --- | --- |
| `dots` | « 01 — Pourquoi agir » (`#enjeux`), « 04 — Les effets attendus » (`#impact`, passée en blanc) et carte des provinces (`#carte-rdc`, « 05 — Les territoires ») ; sans grille de carrés au survol (retirée le 14 octobre 2026 à la demande de l'utilisateur), à 85 % de son intensité | Trame de points bleus en deux grilles décalées de 28 px, marquée sur les bords et presque effacée au centre, derrière le texte. Dans les sections limitées à la largeur du contenu, elle s'étend à toute la largeur de l'écran (`bleed`) ; `.home-content` coupe le débordement horizontal (`overflow-x: clip`, compatible avec les éléments collants). |
| `lattice` | Sections bleues : « Découvrir », mission, appel au don | Réseau hexagonal à la manière d'une structure moléculaire (tuile SVG de 84 × 48, traits blancs fins, atomes blancs et jaunes à certains nœuds) sur les côtés, rayons fins partis de deux coins, halos bleu et jaune ; rien derrière le texte. |
| `hero` | Photo d'ouverture du film (la salle de laboratoire, depuis le 15 octobre 2026), sur tout l'écran : le calque `.film-hero-motif` est placé dans celui de la photo, au-dessus de son dégradé et sous la scène 3D ; il s'efface avec la photo et ne passe jamais sur les chapitres suivants. Même calque sur l'image d'en-tête de la lecture simple. | Réseau moléculaire, un peu plus léger derrière le message (à gauche sur ordinateur, en bas sur téléphone), cinq points scintillants (jaune, blanc, rouge), halo jaune. |

## Au passage du curseur

Comme sur movix.fun, une grille invisible s'allume autour de la souris (`CursorGrid.tsx`, un canevas par section texturée) : la cellule survolée s'éclaire, ses voisines aussi, puis elles s'éteignent en 0,7 s derrière le curseur, qu'un halo accompagne. La grille reprend celle de la texture :

- sections bleues (`lattice`) : les hexagones du réseau moléculaire, en jaune ;
- les sections claires (`dots`) n'ont pas de grille au survol : les carrés bleus essayés un temps ont été retirés à la demande de l'utilisateur ; la trame de points reste fixe.

Au repos, les textures sont réduites à 45 % de leur intensité (`.motif-texture`), pour rester à peine visibles : le curseur les révèle. Souris seulement (`hover: hover` et `pointer: fine`) : rien au toucher ni si les animations sont réduites. La lumière s'éteint au défilement et reprend au mouvement suivant. Le canevas ne se redessine que pendant un mouvement ou une extinction.

## Fond commun des sections 04 et 05

« 04 — Les effets attendus » et « 05 — Les territoires » partagent un même fond blanc (trame de points et instruments du jeu `impact`), collé à l'écran pendant leur défilement : seuls les textes, les cartes et la carte des provinces bougent (`.home-still` dans `Home.tsx` et `home-editorial.css`). Le fond fait la hauteur de l'écran (`position: sticky`, marge négative de 100svh), ce qui fonctionne aussi sur iPhone, contrairement à `background-attachment: fixed`. Les deux sections sont transparentes au-dessus.

## Fil du voyage

La route jaune en pointillés de la carte du film :

- sous la navigation « 01 Pourquoi agir … 05 Les territoires », elle relie les cinq repères (à l’horizontale sur ordinateur, à la verticale sur téléphone) et se trace au défilement ;
- dans l’appel au don, elle traverse les instruments jusqu’à un point d’arrivée. Elle est masquée sur téléphone, où elle traverserait le texte.

## Mouvement et accessibilité

- Les motifs sont décoratifs (`aria-hidden`) et passent sous le contenu de la section.
- La parallaxe et le tracé utilisent les timelines de défilement CSS (`animation-timeline: view()`), là où le navigateur les prend en charge ; ailleurs, les motifs restent fixes.
- Avec la préférence de mouvements réduits, rien ne bouge.

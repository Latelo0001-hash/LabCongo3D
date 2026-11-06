# Hero — amélioration du 12 octobre 2026

Le message d’accueil utilise la vidéo d’ouverture déjà présente. Sa composition a été affinée pour donner davantage de place à la photographie et rendre la mission plus lisible.

## Présentation

- Titre en casse naturelle sur deux lignes, avec une graisse cohérente pour l’accent jaune.
- Texte d’accompagnement agrandi : 18 à 22 px sur ordinateur, 17 à 20 px sur tablette et téléphone, 16 px dans les fenêtres mobiles peu hautes. La description reste affichée.
- Dégradé marine renforcé du côté du texte ; court trait jaune et rouge au-dessus du titre.
- Boutons plus spacieux, sur toute la largeur sous 600 px, avec un survol discret des flèches.
- Lecture simple : même photographie et même message d’accueil, avec crédit visible, sans vidéo ni scène WebGL. Les préférences de mouvements réduits sont respectées.

La première intervention sur le hero est limitée à [FilmSequence.tsx](../src/features/film/FilmSequence.tsx) et [film.css](../src/features/film/film.css). Elle reprend les modifications déjà présentes dans le projet indépendant `labcongo-3d`.

## Vérifications

- Compilation TypeScript/Vite, ESLint et `git diff --check` : réussis. L’avertissement Vite existant concernant le module Three.js de 997 Ko subsiste.
- Version compilée dans Chrome pour macOS, avec WebGL logiciel : 1920 × 1080, 1440 × 900, 1024 × 768, 820 × 1180, 390 × 844, 320 × 568 et 1440 × 600. Aucun débordement horizontal ; description visible ; message d’accueil séparé du menu et des commandes du film.
- Passage au premier chapitre et navigation des huit étapes : un seul titre de chapitre visible à la fois.
- Liens « Découvrir le projet » (au clavier) et « Soutenir LabCongo » : arrivée aux sections prévues, avec leur marge d’ancrage de 28 px.
- Lecture simple, retour au film et mouvements réduits : photographie chargée, huit chapitres présents ; aucun canvas ni vidéo dans la lecture sans animation. Contrôles à 1440 × 900, 390 × 844, 320 × 568 et 844 × 390.
- Aucune exception JavaScript observée pendant le parcours final.

[Ordinateur](validation/hero-affine-ordinateur.jpg) · [Téléphone](validation/hero-affine-telephone.jpg) · [Lecture simple](validation/hero-affine-lecture-simple.jpg) · [Résultats des contrôles](validation/hero-affine-controles.json).

Les essais sur Safari et appareils physiques restent à effectuer. Travail local, sans publication.


## Harmonisation des huit chapitres

Les textes du récit reprennent le style du hero : même famille de caractères, graisse, casse naturelle et interligne. Chaque titre conserve son texte, avec une expression clé mise en couleur. Le jaune est utilisé sur les scènes sombres et le bleu LabCongo sur les scènes claires, pour préserver le contraste. Les repères reprennent le trait jaune et rouge du hero.

Les paragraphes sont agrandis et les espacements s’adaptent à la hauteur de l’écran. Le fondu accompagne désormais les titres sans effet de lettres brouillées. La lecture simple utilise les mêmes titres et les mêmes styles.

Fichiers concernés : [FilmSequence.tsx](../src/features/film/FilmSequence.tsx), [film.css](../src/features/film/film.css), [filmTimeline.ts](../src/features/film/filmTimeline.ts).

Vérification sur la version compilée : huit chapitres à 1440 × 900, 820 × 1180, 390 × 844, 320 × 568, 1440 × 600 et 1024 × 600. Textes dans l’écran, séparés des commandes et des indications de matériel ; un seul titre visible par scène. Lecture simple contrôlée à 1440 × 900, 390 × 844 et 320 × 568. Compilation, ESLint et vérification des différences réussis ; aucune exception JavaScript observée. Essais Chrome avec WebGL logiciel, à compléter sur Safari et appareils physiques.

[Chapitre matériel](validation/chapitres-style-materiel.jpg) · [Chapitre navire](validation/chapitres-style-navire.jpg) · [Téléphone](validation/chapitres-style-telephone.jpg) · [Résultats](validation/chapitres-style-controles.json).

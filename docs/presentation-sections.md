# Présentation des sections — 8 octobre 2026

La passe concerne le contenu de l’accueil après le film, y compris les sections ouvertes dans « Le projet en détail ». Les textes et sources de `presentation.ts`, les médias fournis et les composants fonctionnels existants constituent la base.

## Organisation retenue

| Bloc | Présentation | Couleurs |
| --- | --- | --- |
| Accès au projet | Introduction courte, liens utiles et sommaire des cinq sections | Marine et bleu LabCongo, accent jaune |
| 01 — Constat | Citation en deux colonnes avec contexte | Blanc, bleu profond, repère rouge |
| 02 — Le constat et l’enjeu | Trois constats puis chiffres de contexte regroupés | Bleu très clair ; chiffres sur bleu profond |
| 03 — La réponse : LabCongo | Grande photographie et texte, appel à découvrir la mission | Bleu LabCongo nuancé, texte blanc, bouton jaune |
| 04 — Approche | Trois étapes illustrées puis les cinq phases | Blanc et bleu clair, numéros rouges |
| 05 — Résultats attendus | Quatre familles d’objectifs en grille lisible | Marine, nuances bleues, repères jaunes |
| 06 à 15 — Détails | Titres, espacements, panneaux, carte et listes harmonisés | Alternance de blanc et bleu clair ; voyage bleu profond |
| 16 — Participation | Appel final et trois actions hiérarchisées | Dégradé bleu, action principale jaune |

## Règles

- Bleu du logo `#0054a6` dominant ; marine `#031b4e`, bleu intermédiaire et teintes pâles pour varier les fonds.
- Rouge `#e21a22` pour les repères courts ; jaune `#fff200` sur fond bleu pour les actions et accents.
- Police éditoriale et logo existants conservés. Corps de texte avec longueur de ligne limitée ; espacement régulier entre sections.
- Styles limités à `.home-content` pour préserver les pages publiques et le film au défilement.
- Sommaire en ancres accessibles, sans barre flottante sur la scène ; liens vers les détails toujours fonctionnels.
- Les chiffres de contexte et les objectifs restent distincts des réalisations publiées.

## Typographie agrandie

Les paragraphes des sections principales et détaillées passent à **18–20 px**, contre 13–15 px auparavant. Les introductions atteignent **20–24 px**, les titres de cartes **24–28 px** et les titres principaux s’adaptent à la largeur de l’écran. Les tailles utilisent `rem` et `clamp` pour respecter la taille de police de base du navigateur.

Les liens et boutons passent à 16 px ; les légendes et informations secondaires à 14 px. Les interlignes, marges et hauteurs des boutons accompagnent cette nouvelle échelle. Les cartes ont des angles légèrement arrondis.

Sur tablette, les étapes illustrées occupent la largeur disponible avec la photo à côté du texte. Les constats et rôles des partenaires s’empilent avant que leurs colonnes deviennent trop étroites. Sur téléphone, images et textes se succèdent dans une colonne. Les couleurs LabCongo restent dominées par le bleu.

Contrôles de cette passe : compilation, lint et revue Chrome aux largeurs 1440, 768, 390 et 320 px. La taille calculée des paragraphes est au moins de 18 px dans neuf types de contenu. Les derniers ajustements tablette et petit téléphone sont aussi vérifiés avec réduction des animations. Aucun débordement horizontal ni exception JavaScript relevés dans ces parcours.

[Contrôles de typographie](validation/typographie-controles.json) · [Avant/après sur ordinateur](validation/typographie-suivi-ordinateur.png) · [Constats sur tablette](validation/typographie-constats-tablette.png) · [Textes sur téléphone](validation/typographie-enjeux-telephone.png)

## Livraison et vérifications

- `src/styles/home-editorial.css` regroupe la palette et les règles de présentation, limitées à l’accueil.
- `JourneyAccess` expose le sommaire ; `HomeDetails` reconnaît les nouvelles ancres des sections visibles.
- `IntroSection`, `MissionSection` et `ProcessSection` portent les mises en page de citation, de mission illustrée et d’approche en trois cartes.
- `npm run build`, `npm run lint` et `git diff --check` passent.
- Contrôle Chrome local aux largeurs 1440, 768, 390 et 320 px : absence de débordement horizontal, cibles du sommaire présentes et accès aux enjeux sans ouvrir le volet détaillé.
- Ouverture des détails et sélection d’une province vérifiées à 1440, 768 et 390 px. Navigation vers le catalogue équipements vérifiée ; le conteneur des nouveaux styles y est absent.
- Aucune exception JavaScript relevée pendant ces parcours. La vérification couvre les interactions citées, sans constituer un audit complet d’accessibilité ou de tous les navigateurs.

Archives de la mise en page initiale, avant agrandissement : [rapport des contrôles](validation/presentation-controles.json) · [Vue ordinateur](validation/presentation-mission-ordinateur.png) · [Vue tablette](validation/presentation-approche-tablette.png) · [Vue téléphone](validation/presentation-enjeux-telephone.png) · [Appel à participer](validation/presentation-actions-telephone.png)


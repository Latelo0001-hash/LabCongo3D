# LabCongo — finition visuelle, 21 octobre 2026

## Direction

Conserver les contenus, les interactions, les photographies et la palette du logo. Le hero et le film ne font pas partie de cette passe.

- DM Serif Display pour les titres éditoriaux ; Manrope pour les textes et les titres de cartes. Polices libres hébergées localement, avec leurs licences.
- Titres plus équilibrés, textes confortables et longueur de ligne maîtrisée. Repères de section bleus avec un accent rouge.
- Surfaces blanches, fonds bleu pâle et blocs bleu nuit pour les messages clés. Réserver le jaune aux petits accents sur fond sombre.
- Cartes avec une bordure fine, des angles arrondis et une ombre légère. Distinguer les étapes, les indicateurs et les contributions.
- Sommaires sous forme de liens en capsules ; formulaires blancs, champs lisibles à 16 px minimum et actions clairement visibles.
- Appliquer ce langage aux neuf pages institutionnelles, aux catalogues et aux sections après le hero. Préserver les contrastes, les focus clavier et la réduction des animations.

## Vérification réalisée

- ESLint, compilation TypeScript/Vite et `git diff --check` réussis. L’avertissement existant sur la taille du paquet 3D demeure.
- Chrome : 12 pages (les neuf rubriques, équipements, confidentialité et mentions légales) à 1 440, 820, 390 et 320 px. Aucun débordement horizontal, une seule balise h1 par page, cibles des sommaires présentes, polices locales chargées et champs de saisie à 16 px minimum. Aucune erreur JavaScript ou réponse HTTP locale en erreur dans ce parcours.
- Accueil après le hero : cinq sections contrôlées à 1 440, 390 et 320 px (constat, approche, pilote, impact et soutien). Le hero conserve sa police et reste hors des règles des pages publiques.
- Captures examinées sur ordinateur et mobile : approche, projet pilote, impact, écoles, partenaires, actualités, soutien, contact et équipements ; constat et appel à contribuer après le hero.
- Don matériel : validation des champs obligatoires vérifiée. Menu mobile : fermeture avec Échap et restitution du focus vérifiées. Aucun message envoyé.
- Corrections après revue : crédits photographiques plus contrastés et empilés ; espacement vertical du formulaire mobile fixé à 32 px, sans pourcentage dépendant de sa hauteur.

Les scripts et captures de contrôle restent dans `/tmp/labcongo-structure-review`. La vérification utilise Chrome local et le mode de mouvements réduits ; elle ne constitue pas un audit multi-navigateurs ou une nouvelle validation des animations du film.

## Navigation simple

Le bandeau présente directement les rubriques sur ordinateur (huit liens et le bouton « Nous soutenir »). Sous 1 280 px, une liste unique des neuf rubriques s’ouvre depuis « Menu ». Les liens de la page courante sont mis en évidence. Les regroupements sont réservés au pied de page.

Contrôle du bandeau sur les pages publiques et le hero à 1 440, 1 280, 1 180, 820, 390 et 320 px : liens directs, absence de débordement et de chevauchement, fermeture au changement de page, Échap et restitution du focus. Aucun fichier du film modifié.

Le bandeau comprend aussi le sélecteur Fr / En, visible sur ordinateur et mobile. Fr indique la langue actuelle ; En est désactivé et annoncé « bientôt disponible » tant que les pages anglaises ne sont pas traduites. Aucun changement de langue fictif ni service de traduction tiers n’est ajouté. L’espace du bandeau a été revérifié aux six largeurs ci-dessus ; ESLint et compilation réussis.

## Couleurs et contraste — 22 octobre 2026

La référence Smartcat est reprise dans la répartition des couleurs : grandes surfaces claires, blocs bleu nuit et dégradés bleus lumineux concentrés sur les appels à participer. La palette reste celle de LabCongo ; le hero, le bouton vert et le fond cartographique du footer sont préservés.

- Accueil : impact en bleu nuit, cartes sombres et repères jaunes. Présentation et appel final avec une lumière bleue plus affirmée. Constat, pilote et partenaires sur des surfaces claires sobres.
- Pages : enjeu national dans À propos, diagnostic du Projet pilote et effets attendus dans Impact en blocs sombres. Appels à contribution avec un dégradé bleu lumineux. Les cartes ordinaires redeviennent blanches pour réserver les effets aux moments clés.
- Jaune du logo sur fond sombre et bleu de la marque sur fond clair ; les objectifs restent présentés sans chiffres inventés.
- Chrome : six vues à 1 440 et 390 px, soit douze contrôles sans débordement horizontal. Captures examinées, bouton de soutien toujours vert. Contrastes des nouveaux textes et repères calculés ; ESLint, compilation et contrôle des espaces Git réussis.

Captures et script temporaires dans `/tmp/labcongo-color-*`. Ces contrôles utilisent le mode de mouvements réduits et ne remplacent pas une revue complète des animations du film.

La palette reste limitée au bleu, au rouge et au jaune du logo, avec leurs nuances claires et foncées. Les accents turquoise et les cartes vert pâle ont été retirés. Le vert est réservé au bouton « Nous soutenir », conformément au choix explicite de l’utilisateur.

## Fonds illustrés fournis

Les cinq images ajoutées sont réparties sur l’impact, l’enjeu national, le pilote, l’appel à contribuer, les résultats et les voix du terrain. Voir l’inventaire dans `public/images/backgrounds/README.md`. Des voiles clairs ou bleu nuit maintiennent les contrastes ; les motifs de l’appel final sont retirés pour laisser la place à l’image des élèves.

La section Témoignages est désormais visible sur l’accueil, après les partenaires. `#temoignages` rejoint cette section. Aucune citation n’est ajoutée : les données restent vides et l’invitation à partager une expérience est affichée.

ESLint et compilation réussis. Chrome : six sections à 1 440 et 390 px, sans débordement ; les fonds utilisent bien les variantes 1 600 et 768 px respectivement. Captures examinées sur ordinateur et mobile. Outils temporaires : `/tmp/labcongo-background-review.*`. Le hero et les nouveaux médias du film scolaire n’ont pas été modifiés pendant cette intégration.

## Section Territoires

La carte et la fiche de province sont présentées dans deux blocs clairs, avec une barre de sélection, un repère « 26 provinces » et l’intitulé de la vue en cours. Les actions vers les écoles et la présentation d’un établissement sont distinguées ; cette dernière présélectionne le motif école dans Contact. Les couleurs restent bleues, avec le focus clavier rouge.

Contrôles Chrome à 1 440, 820, 390 et 320 px : 26 provinces affichées, sélection au clavier, synchronisation de la liste et du panneau, réinitialisation et sélection par liste réussies. Aucun débordement horizontal ; champ de sélection à 16 px. Captures ordinateur et mobile examinées. ESLint, compilation et `git diff --check` réussis. Outils temporaires : `/tmp/labcongo-map-review.*`.

## Participation et soutien

Sur l’accueil, la présentation des partenaires et l’appel au soutien sont réunis dans le bloc final « Participer · Nous soutenir ». Il conserve les trois façons de contribuer et ajoute un accès « Devenir partenaire ». Les partenaires confirmés s’affichent dans ce même bloc lorsqu’ils sont disponibles. L’ancre `#partenaires` est conservée à cet endroit. Les pages Partenaires et Nous soutenir restent accessibles séparément depuis le menu.

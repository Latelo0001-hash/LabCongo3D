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

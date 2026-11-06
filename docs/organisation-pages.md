# Pages essentielles — 22 octobre 2026

## Arborescence retenue

| Page | Rôle |
| --- | --- |
| Accueil | Hero et récit synthétique du projet. |
| À propos | Constat, enjeu national, mission, équipe et expérience antérieure. |
| Notre approche | Trois piliers, parcours du matériel et accompagnement. |
| Projet pilote | Phases, diagnostic, résultats attendus, impact et indicateurs de suivi. |
| Écoles & réalisations | Annuaire, fiches et avant/après, sans catalogue de projets vide en parallèle. |
| Nous soutenir | Contributions, matériel et partenariats avec leurs formulaires. |
| Contact | Demandes et coordonnées. |

Le menu garde six rubriques et le logo ramène à l’accueil. La présentation, les couleurs et le hero sont conservés.

## Regroupements et retraits

- Impact est intégré à Projet pilote, avec ses quatre niveaux, la méthode de mesure et le contexte national.
- Partenaires est intégré à Nous soutenir, avec les rôles, les partenaires confirmés et le formulaire.
- Les listes Projets et Actualités sont retirées : leurs données sont actuellement vides. L’accueil garde son espace d’actualités et les réalisations restent rattachées aux écoles.
- L’ancien composant Mission, inutilisé, est retiré ; son contenu actuel est déjà dans À propos.
- Les anciens modules Process/sections qui ne retournent que `null` sont retirés après contrôle des imports.

## Accès secondaires conservés

Fiches d’écoles, fiches de projets/articles pour les contenus publiables, catalogue et fiches de matériel, parcours photographique et ses crédits, confidentialité, mentions légales et page introuvable. Ces pages ne surchargent pas le menu ; elles répondent à un besoin précis ou à un lien de contenu. Les sources de données sont conservées.

## Compatibilité

Les anciennes adresses Impact et Partenaires redirigent vers leurs nouvelles sections, avec préservation des paramètres et adaptation des ancres. Projets et Réalisations rejoignent Écoles & réalisations ; Actualités rejoint l’espace correspondant sur l’accueil. Les liens internes doivent utiliser les nouvelles destinations directement.

## Vérification réalisée

Compilation et ESLint réussis, aucun import des neuf fichiers retirés. Chrome : les six rubriques à 1 440, 390 et 320 px, puis onze anciennes adresses, soit 29 contrôles sans erreur. Un titre principal par page, aucun débordement horizontal, sommaires valides et deux formulaires présents dans Nous soutenir. Les redirections conservent les paramètres et rejoignent des ancres existantes. Les captures des contenus regroupés ont été examinées sur ordinateur et mobile. Scripts et captures temporaires : `/tmp/labcongo-pages-review.*`.

# Validation de la partie publique — 2 octobre 2026

## Vérifications effectuées

- `npm run lint` : réussi, sans erreur ni avertissement ESLint.
- `npm run build` : réussi. Vite signale la taille du paquet Three/R3F (~984 ko minifié, ~263 ko gzip), chargé séparément et à la demande.
- Chrome automatisé : les 12 routes publiques principales ont été contrôlées en 320, 390, 820 et 1 440 px ; un titre principal par page, une description SEO et aucun débordement horizontal.
- Accueil : les 17 sections sont présentes. Les six dernières sections ont aussi été parcourues avec les animations actives dans la version compilée.
- Trois GLB : chargement local et changement de modèle/angle vérifiés. Aucun décodeur distant. Repli testé avec réduction des animations, WebGL indisponible, perte de contexte et modèle absent.
- Formulaires : champs obligatoires et validation conditionnelle du don, du partenariat et de la présentation d’école ; adresse e-mail invalide ; préparation du brouillon, destinataire et contenu du lien mailto ; focus sur le brouillon ; invalidation après modification. Vérifiés sur ordinateur et mobile. Aucun e-mail de test envoyé.
- Projets et actualités : filtres, recherche insensible aux accents pour les projets, listes et fiches avec données synthétiques injectées uniquement dans le navigateur. Brouillons et actualités futures masqués ; liens absents en noindex ; redirection `/realisations` vérifiée.
- Publication : témoignage sans consentement masqué ; chiffre sans source masqué. Aucun exemple synthétique ajouté aux données livrées.
- Menu mobile : navigation, fermeture avec Échap et restitution du focus vérifiées.
- Version compilée : navigation entre pages, métadonnées uniques et titre dynamique, chargement GLB et formulaire d’école vérifiés ; aucune erreur JavaScript non interceptée ni réponse réseau en erreur dans ce parcours.

Les scripts de vérification navigateur de cette session sont dans `/tmp/lc-browser-review` et utilisent Playwright Core avec Chrome local. Ils ne font pas partie des dépendances du site.

## Corrections issues des essais

Les métadonnées statiques concurrentes de `index.html` ont été supprimées. Les titres dynamiques sont fournis à Helmet sous forme d’une chaîne unique, compatible avec le traitement natif des métadonnées de React 19. Le libellé de la carte du Hero a été raccourci pour sa lisibilité mobile.

## Limites de validation et suites

Cette vérification couvre Chrome local, pas une certification multi-navigateurs ni un audit de performance complet. Aucun hébergement de production, API, envoi serveur, paiement ou espace administrateur n’est activé. Les formulaires nécessitent un envoi par le visiteur depuis sa messagerie ; la copie du brouillon reste proposée.

Les contenus des écoles, projets, actualités, partenaires, témoignages et statistiques attendent validation. Les photos fournies attendent confirmation des droits et légendes. Les modèles GLB sont des illustrations originales et non des reproductions d’installations réalisées. Le pré-rendu/SSR, le domaine définitif et les documents légaux relèvent de la préparation à la publication.

## Mise à jour photographique — 5 octobre 2026

- `npm run build` et `npm run lint` réussis. Les pages publiques n’importent plus Three/R3F ; le paquet 3D de l’ancienne version n’est plus produit par Vite et l’avertissement de taille associé disparaît.
- Version compilée, Chrome : douze scènes parcourues à 1440 × 900, 820 × 1000, 390 × 844, 320 × 740 et 1440 × 600. Essais avec animations actives et réduites. Aucun débordement horizontal, erreur JavaScript ou réponse HTTP en erreur sur ces parcours.
- Navigation : sélecteur de douze scènes, curseur avec Home/End, états des boutons précédent/suivant, défilement en arrière, mode manuel et version sans animation. La scène reste sélectionnée et le parcours reste visible lors des changements de mode.
- Récit : douze entrées, retour vers la scène demandée et focus sur son titre. Les dix crédits photographiques sont consultables.
- Aucun Canvas ni téléchargement GLB sur les parcours testés. Accueil, Mission, Notre démarche et À propos : toutes les nouvelles images chargées dans la version compilée.
- Images bloquées volontairement dans Chrome : message de remplacement lisible et navigation entre scènes encore fonctionnelle.
- Captures ordinateur, mobile et accueil examinées visuellement. Outils temporaires : `/tmp/lc-photo-work`, hors des dépendances du projet.

Les essais antérieurs sur les GLB décrivent le prototype du 2 octobre. La version publique actuelle utilise des photographies d’illustration, avec une correspondance éditoriale parfois partielle : la prise de vues propre aux activités de LabCongo reste à réaliser. Voir [la couverture et les sources](experience-photographique.md).

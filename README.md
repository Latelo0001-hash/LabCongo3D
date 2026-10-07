# LabCongo 3D

Projet React indépendant du site PHP historique. Accueil immersif en cinq premières étapes, contenus détaillés accessibles à la demande, parcours photographique en douze scènes et pages publiques. Voir la [reprise du 7 octobre](docs/accueil-immersif.md) et la [passe sur le réalisme](docs/amelioration-realisme.md). Les informations de terrain attendent leur validation ; le serveur et l’administration restent une phase distincte.

## Pack visuel de la nouvelle expérience

L’image maître et les trois personnages sont validés. Six nouvelles références fixes couvrent le laboratoire, le matériel, la mise en caisse et le conteneur : voir la [galerie de revue](docs/media-pack/revue.html) et le [pack média en préparation](docs/media-pack/README.md), avec l’inventaire des 21 médias. Cinq références sont désormais intégrées à l’accueil sous forme de copies WebP : fonds de scène et lecture simple. Les vidéos restent une production distincte ; elles ne sont pas nécessaires au prototype au défilement.

## Lancer

```sh
npm install
npm run dev
```

Ouvrir l’adresse affichée par Vite. Node 22.12+ ou une version récente compatible Vite est requis.

## Vérifier

```sh
npm run lint
npm run build
npm run preview
```

## Architecture

- `src/app` : providers et routes avec chargement différé.
- `src/features/immersive` : accueil au défilement, scène R3F persistante, timeline commune et lecture simple.
- `src/pages/Home/sections` : sections éditoriales conservées dans « Le projet en détail », avec chargement différé. Le CTA reste visible après cette zone et l’ancien hero reste archivé dans les sources. Les zones sans données validées présentent un état explicatif.
- `src/pages` : toutes les routes demandées, avec annuaire et fiches d’écoles, catalogue et fiches d’équipements. Les pages du projet, de mission, de démarche, d’impact, des partenaires, des dons et du contact sont développées, ainsi que les listes et fiches de projets et actualités. `/realisations` redirige vers les projets réalisés.
- `src/components/animations` et `src/hooks` : GSAP/ScrollTrigger et Lenis, nettoyés au démontage ; réduction des animations respectée.
- `src/features/experience` : parcours photographique en douze scènes, navigation par défilement ou commandes, mode sans animation et crédits. Les anciens décors humains en blocs restent archivés. Le nouvel accueil utilise trois modèles détaillés dans une scène distincte, générés par `npm run models:immersive`.
- `src/services` : frontière API, pas de requête sans `VITE_API_BASE_URL`.
- `src/features`, `src/types`, `src/data`, `src/config` : domaines réservés et configuration.
- `server` et `admin` : prochaines phases uniquement.

React 19, TypeScript, Vite, Tailwind (plugin Vite), React Router, GSAP, Lenis, Three/R3F/Drei, TanStack Query et Zustand sont configurés. Les formulaires utilisent React Hook Form et Zod. Swiper est installé ; il n’est pas utilisé pour des listes vides. Lucide fournit les icônes. Helmet gère les titres des routes. Avec React 19, chaque titre est une chaîne unique ; `index.html` ne contient pas de titre ou de description concurrente.

## Limites de cette étape

Pas de back-end, d’administration fonctionnelle ni d’envoi côté serveur. Les formulaires préparent un e-mail que le visiteur doit relire et envoyer dans sa messagerie ; aucun paiement n’est encaissé. Pas d’école, de réalisation, de partenaire, de témoignage ni de chiffre inventé. L’accueil utilise des illustrations générées, explicitement identifiées, et des objets 3D provisoires. Les photos documentaires et leurs crédits restent dans le parcours photographique existant. Les photos de laboratoire fournies restent à valider pour publication. L’équipement hospitalier est décrit uniquement comme expérience antérieure de l’équipe et preuve de capacité logistique, conformément au cahier des charges. Aucun lieu, date, établissement ou résultat chiffré non confirmé n’est ajouté.

En production, configurer le serveur pour rediriger les routes publiques vers `index.html`. Générer un sitemap avec le domaine final et les contenus publiables ; pour un référencement complet, prévoir pré-rendu/SSR lors de la phase SEO. Aucun secret ne doit être placé dans les variables `VITE_*`.

## Identité visuelle

Logo couleur et version blanche fournis dans `src/assets/img/Logo/PNG`, réduits à 800 px pour le web. Les originaux sont conservés. Favicon et icône Apple fournis dans `src/assets/img`. Couleurs extraites du logo : bleu `#0054a6`, rouge `#e21a22`, jaune `#fff200`. Le bleu foncé `#031B4E` reprend celui du site historique pour les textes et fonds.

## Accueil : collecte et acheminement

Les sections Collecte et Voyage présentent le matériel concerné et les étapes prévues de sa transmission. Le tracé SVG est schématique (aucun port, délai ni itinéraire réel annoncé). GSAP anime le tracé et un colis au défilement sur ordinateur ; les étapes restent lisibles sur mobile et avec réduction des animations. La page de don permet de préparer une proposition ; les écoles attendent leurs données validées.

## Carte des provinces

Carte locale en SVG des 26 provinces de la RDC, sélection au clic/clavier et par liste. Aucune école ou intervention fictive. La géométrie n’est téléchargée qu’à l’approche de la section ; le cache TanStack Query évite les rechargements pendant la navigation. La liste reste disponible si la carte échoue à charger. Source : geoBoundaries / OpenStreetMap, données 2017, ODbL ; attribution et fichier source téléchargeable dans la section. Voir public/maps/README.md.

## Catalogue des écoles

`src/data/schools.ts` reste vide jusqu’à réception de données validées. `School` définit les champs requis. Seules les fiches `publicationStatus: "published"` sont visibles ; une école publiée avec des besoins identifiés n’est pas présentée comme équipée. L’accueil, la carte, l’annuaire et les détails partagent `features/schools/services/catalog.ts`. Recherche insensible aux accents, filtres par province et avancement, paramètres conservés dans l’URL. Les slugs absents et les brouillons affichent une fiche indisponible avec `noindex`. Les boutons de contact et de don rejoignent les formulaires de préparation d’un e-mail.

## Comparaisons et galerie

`src/data/comparisons.ts` reçoit uniquement des paires documentées du même lieu. Une comparaison est visible si elle est publiée **et** rattachée à une école publiée. L’accueil et la fiche école partagent ce filtre. Les photos avant/après doivent avoir un cadrage comparable (cadre 3:2). Sans données, une présentation du suivi photographique remplace le comparateur. Le comparateur fonctionne au toucher, à la souris et avec un curseur clavier ; les boutons affichent chaque vue en entier. La galerie ouvre un dialogue natif avec Échap, flèches, confinement et restitution du focus. Les images indisponibles affichent un repli explicite.

## Équipements

Quatre familles pédagogiques, sans stock ni quantité de dons annoncés, sont définies dans `src/data/equipment.ts`. L’accueil, le catalogue filtrable (`?usage=`) et les fiches partagent ces données. Les illustrations SVG sont créées dans le code, indépendantes des scènes Three.js. Les liens de proposition mènent au formulaire de don matériel.


## Expérience photographique et performances

Le choix visuel du 5 octobre remplace les décors et personnages en blocs par des photographies. Voir [la direction, la couverture et les sources du parcours](docs/experience-photographique.md). `/experience` conserve les douze scènes et le défilement avec navigation directe. Les images sont locales, livrées en variantes adaptées à l’écran, et les crédits sont accessibles dans le récit. Depuis la reprise du 7 octobre, l’accueil charge à nouveau Three.js et trois GLB compressés en mode animé uniquement ; le parcours photographique `/experience` reste indépendant.

Les scripts `models:generate` et `models:story`, les modèles et les anciens composants restent disponibles. Le nouvel accueil utilise désormais les versions détaillées distinctes dans `public/models/immersive/`, dont les matériaux restent illustratifs. Les exécuter ne modifie pas la présentation photographique actuelle.

## Projets, actualités, partenaires et indicateurs

- `src/data/projects.ts` : fiches publiées, statut de préparation/en cours/réalisé, sections textuelles, images et liens vers les écoles publiées. Recherche et filtres conservés dans l’URL.
- `src/data/articles.ts` : seules les actualités publiées à une date passée ou présente sont visibles. Filtres par rubrique et détail avec date.
- `src/data/partners.ts` : partenaires confirmés uniquement ; aucun logo de tiers inventé.
- `src/data/testimonials.ts` : publication conditionnée au statut publié et à `consentToPublish`.
- `src/data/statistics.ts` : valeurs finies, positives ou nulles, avec source et période. Sans données, la page explique les indicateurs à documenter. Un compteur animé respecte la réduction des animations.

Les slugs absents, les brouillons et les actualités futures renvoient une vue indisponible avec `noindex`. Le filtrage dans le client est une règle d’affichage : ne jamais intégrer de données privées aux fichiers livrés au navigateur. Une API devra assurer les droits d’accès lorsque le serveur sera ajouté.

## Formulaires

Contact, proposition de matériel, présentation d’école et partenariat partagent `components/forms/MessageForm.tsx` et le schéma Zod de `features/contact/message.ts`. Validation contextuelle, erreurs associées aux champs, brouillon accessible et lien `mailto:info@labcongo.org`. Modifier un champ invalide le brouillon pour éviter l’envoi d’une ancienne version. La copie manuelle reste possible si le presse-papiers ou la messagerie ne fonctionne pas. Aucune persistance de la saisie, pièce jointe ni requête d’envoi depuis le site. Ajouter photos et documents dans la messagerie.

## Contenus de référence et publication

Le texte institutionnel reprend le cahier des charges fourni et les pages éditoriales du site historique (mission, collecte Belgique/France, acheminement vers la RDC, formation et suivi). Les fichiers `mock-data.sql` ne sont pas des sources de réalisations. Les photos fournies restent à valider (provenance, droits et légendes) avant publication. La récupération du Drive, les textes statutaires et les contenus des bénéficiaires sont en attente. La préparation SEO côté client ne remplace pas le pré-rendu ou SSR prévu pour la mise en ligne.


## Validation

Voir [le compte rendu de validation de la partie publique](docs/validation-front-end.md) pour les essais réalisés, les corrections et les limites de cette version.

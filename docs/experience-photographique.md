# Parcours photographique — 5 octobre 2026

## Direction retenue

À la demande de l’utilisateur, les décors et personnages 3D en blocs sont remplacés par des photographies de lieux, objets et personnes réels. Les photographies d’illustration sont autorisées en attendant les images des activités de LabCongo. L’identité officielle, les douze scènes, le défilement et la navigation directe sont conservés. Aucun reportage LabCongo ni bénéficiaire n’est inventé.

## Réalisation

- `/experience` : photographies plein cadre, zoom discret piloté par le défilement et apparition douce au changement de scène. Aucune boucle automatique, aucun Canvas ni GLB chargé.
- Défilement sur ordinateur à partir de 1000 × 680 px. Navigation par boutons, sélecteur et curseur sur tous les écrans ; navigation manuelle sur les plus petits écrans et en cas de réduction des animations.
- La version sans animation conserve les mêmes photographies. Le changement de mode conserve la scène et replace le lecteur dans le parcours.
- Récit complet consultable sous le lecteur, focus ramené au titre de la scène lorsqu’on y retourne depuis le récit. Carte de RDC conservée, sans points bénéficiaires inventés.
- Accueil, Mission, Notre démarche et À propos : photographies cohérentes avec ce choix. Les anciennes scènes Three.js restent dans les sources à titre d’archive ; aucune page publique ne les importe.
- Dix fichiers photographiques distincts et leurs variantes à 640 px, environ 3,3 Mo en tout. Images locales, tailles adaptées à l’écran, préchargement limité aux scènes voisines, repli explicite en cas d’image absente.

## Couverture des douze scènes

| Scène | Illustration actuelle | Prise de vue à obtenir pour le reportage LabCongo |
| --- | --- | --- |
| 1 Rencontre | Chercheurs au laboratoire, ressource fournie | Façade, couloirs et rencontre de l’équipe |
| 2 Sélection | Instruments et scientifique, ressource fournie | Inspection du matériel retenu |
| 3 Préparation | Paillasse et verrerie, ressource fournie | Protection et mise en caisse |
| 4 Conteneur | Manutention à IJmuiden, photographie Joost J. Bakker | Chargement des caisses de LabCongo |
| 5 Route | Camion avec conteneur en Tchéquie, photographie Midnight Runner | Véhicule chargé, trajet vers le port |
| 6 Traversée | Navire YM Wholesome, photographie Hummelhummel | Expédition documentée du projet |
| 7 Réception | Vue de Matadi, photographie NGAMPUTU SAGE | Équipe locale et ouverture en RDC |
| 8 Distribution | Vue de Matadi, photographie NGAMPUTU SAGE | Tournées vers les établissements |
| 9 École | Classe à Goma, Julie Polumbo / USAID | Accueil dans une école bénéficiaire |
| 10 Installation | Laboratoire scolaire au Cameroun, Agbor2017 | Installation dans les écoles de RDC |
| 11 Pratique | Séance de chimie à Tiko, Agbor2017 | Enseignants et élèves utilisant le matériel reçu |
| 12 Transmission | Classe à Goma, Julie Polumbo / USAID | Séance et témoignages du projet |

Les photos d’illustration ne constituent pas une séquence filmée continue. Plusieurs scènes utilisent le même lieu ou une image de contexte ; les scènes de caisse et d’arrivée restent à documenter précisément. Les lieux photographiés sont indiqués, y compris lorsqu’ils diffèrent du lieu prévu par le scénario. Les images du Cameroun ne sont pas présentées comme des écoles de RDC équipées par LabCongo.

## Sources et remplacement

`src/features/experience/photos.ts` centralise les sources, légendes, auteurs, licences, dimensions et cadrages. `chapterPhotos` associe les images aux identifiants des douze chapitres. Les crédits publics sont accessibles à `/experience#credits-photos`. Les justificatifs de source Wikimedia sont conservés dans `docs/photographs-sources.json` et le détail des licences dans `public/images/story/README.md`.

Les trois images provenant des ressources fournies montrent du travail de laboratoire ; leur auteur et leurs droits ne sont pas documentés dans le dossier et restent à confirmer avant publication. Les autres photographies disposent d’une page source et d’un statut de licence documenté. Les originaux fournis ne sont pas modifiés. Les images Wikimedia dérivées conservent leur licence. Aucun générateur d’images n’a été utilisé pour cette étape.

Pour intégrer un reportage LabCongo, remplacer les médias et leurs légendes dans le registre, avec source, date, établissement et autorisation d’utilisation. Ne pas modifier les données de bénéficiaires pour les faire correspondre aux illustrations.

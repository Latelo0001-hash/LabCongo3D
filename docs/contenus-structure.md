# LabCongo — organisation des contenus

Référence : [plan fourni le 20 octobre 2026](contenus-reference-2026-10-20.md).

## Décision de mise en page

Le hero existant est conservé à la demande explicite de l’utilisateur. La suppression d’« Accueil / Hero » dans le document concerne l’arborescence éditoriale ; les contenus sont repris après le hero. Le film, ses médias et ses interactions restent en place.

## Rubriques et destinations

| Rubrique | Adresse | Contenu |
| --- | --- | --- |
| À propos | `/a-propos` | Constat, enjeu national, association, mission, équipe et expérience antérieure. |
| Notre approche | `/notre-approche` | Trois piliers et parcours en neuf étapes. |
| Projet pilote | `/projet-pilote` | Cinq phases, six axes du diagnostic et suivi des résultats. |
| Écoles & réalisations | `/ecoles` | Établissements, accès aux projets et comparaisons avant/après. |
| Impact | `/impact` | Quatre niveaux d’impact attendu et méthode de mesure. |
| Partenaires | `/partenaires` | Acteurs recherchés et proposition de partenariat. |
| Actualités | `/actualites` | Terrain, écoles, partenariats, collectes, équipements, formations, événements. |
| Nous soutenir | `/nous-soutenir` | Donner du matériel, soutenir un établissement, partager une expertise. |
| Contact | `/contact` | Motifs de demande et coordonnées. |

Les neuf destinations sont accessibles directement : huit liens dans le bandeau sur ordinateur et « Nous soutenir » en bouton. Sur tablette et téléphone, le bouton « Menu » ouvre une liste simple des neuf rubriques. Aucun sous-menu ni regroupement dans le bandeau. Les groupes Comprendre, Découvrir et Participer sont réservés au pied de page. La source commune reste `src/data/navigation.ts`.

Les pages principales proposent une navigation précédente/suivante dans cet ordre. Les pages longues (À propos, Notre approche, Projet pilote, Impact, Partenaires et Nous soutenir) disposent d’un sommaire vers leurs sections. Écoles & réalisations conserve son accès aux établissements, aux interventions et aux comparaisons avant/après ; Actualités conserve ses filtres et Contact son choix de motif.

## Lecture après le hero

1. Le constat.
2. L’enjeu pour la RDC.
3. LabCongo : la réponse et sa mission.
4. Équiper, former et accompagner, pérenniser et relier.
5. Le projet pilote et l’accès au diagnostic.
6. Le parcours en neuf étapes, de l’école à l’usage durable du laboratoire.
7. Les usages pédagogiques et les écoles.
8. L’expérience logistique antérieure.
9. L’impact attendu et la carte des établissements documentés.
10. Les partenaires, les actualités et les trois façons de contribuer.

Les contenus complets sont répartis dans les pages publiques. La comparaison avant/après est placée dans les écoles, les réalisations et leurs fiches ; le projet pilote y renvoie depuis ses résultats.

## Contenus et formulaires

- `src/data/editorialContent.ts` centralise le texte commun aux pages et aux sections.
- Les fiches écoles peuvent inclure niveau d’enseignement, situation initiale, travaux, formations, date et résultats documentés.
- Le bilan d’une intervention peut préciser le nombre d’élèves bénéficiaires, d’enseignants accompagnés, d’équipements installés et de travaux pratiques organisés. Les quantités sont renseignées explicitement, sans les déduire du nombre de familles de matériel.
- Le contact propose les sept motifs du plan. Les anciens motifs témoignage/autre restent compatibles.
- Les champs pays et téléphone complètent nom, organisation, e-mail, objet et message.
- Le formulaire prépare un e-mail à relire et à envoyer depuis la messagerie du visiteur. Il ne simule pas d’envoi ni d’enregistrement serveur.
- Les exemples d’actualités du plan ne sont pas publiés comme des événements réels. Aucun chiffre de résultat, partenaire ou établissement n’est inventé.
- L’équipement hospitalier est une expérience antérieure de l’équipe, et non une branche santé.
- Les statistiques économiques de l’ancienne présentation ne sont pas reprises dans ces pages.

## Compatibilité

`/notre-demarche` redirige vers `/notre-approche` ou vers le diagnostic et les phases du projet pilote selon l’ancre. `/mission` conduit à `/a-propos#mission`. `/faire-un-don` conduit à `/nous-soutenir` en conservant les paramètres et l’ancre.

Les anciens liens d’accueil avant/après, collecte, équipements, chiffres et témoignages conduisent aux rubriques correspondantes.

## Informations à compléter avant publication

Les pages de confidentialité et mentions légales décrivent les informations disponibles et le fonctionnement actuel des formulaires ; elles portent la directive `noindex`. Les références administratives, le responsable de publication, l’hébergeur et les modalités de traitement des messages reçus restent à compléter avec LabCongo. Ces pages ne constituent pas une validation juridique.

Les résultats et photographies de terrain restent soumis à leur validation éditoriale habituelle.

## Vérification du 21 octobre 2026

- Comparaison des neuf rubriques avec le document fourni : constat, enjeu national, mission et expérience hospitalière dans À propos ; trois piliers et neuf étapes dans Notre approche ; cinq phases et six axes du diagnostic dans Projet pilote ; écoles et avant/après ; quatre niveaux d’impact et suivi ; partenaires ; sept catégories d’actualités ; trois formes de soutien ; motifs et coordonnées de contact.
- ESLint, compilation TypeScript/Vite et contrôle des espaces Git réussis. L’avertissement de taille du paquet 3D reste présent.
- Chrome automatisé : les neuf rubriques à 1 440, 390 et 320 px, soit 27 contrôles. Un titre principal par page, aucun débordement horizontal, cibles des sommaires présentes et liens précédente/suivante dans l’ordre attendu. Aucune erreur JavaScript non interceptée.
- Accès au formulaire depuis « Proposer un équipement » vérifié. Captures de Nous soutenir examinées sur ordinateur et mobile. Les autres pages ont fait l’objet des contrôles automatisés ci-dessus, sans revue visuelle exhaustive.
- Outils et captures temporaires : `/tmp/labcongo-structure-review`, sans nouvelle dépendance dans le projet. Aucun contenu de terrain fictif ajouté. Aucun fichier du hero ou du film modifié pendant cette reprise.

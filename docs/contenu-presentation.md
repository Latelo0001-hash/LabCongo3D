> Mise à jour du 20 octobre 2026 : la [structure des contenus](contenus-structure.md) et le [nouveau plan](contenus-reference-2026-10-20.md) remplacent cette organisation éditoriale. Le document ci-dessous reste une trace de la présentation initiale.

# Contenu issu de la présentation de LabCongo — mise à jour du 15 octobre 2026

Source : `LabCongo Presentation fin .pptx`, fournie par l’association (10 diapositives, à la racine du projet, hors dépôt). Le contenu de référence est conservé dans `src/data/presentation.ts`. Les textes de l’accueil ont été réécrits pour le web à partir de cette matière et des sections existantes ; les synthèses des constats, de la démarche et des objectifs se trouvent dans `src/data/homeEditorial.ts`.

## Où se trouve chaque partie

Après le film, l’accueil suit désormais ce parcours : présentation de l’ASBL → pourquoi agir → réponse proposée → démarche → illustration de l’apprentissage → effets attendus → carte → contenus complémentaires → contribution.

| Contenu de référence | Présentation sur le site |
| --- | --- |
| Constat et enjeu | Trois constats reformulés dans « Pourquoi agir ». Les chiffres détaillés restent sur la page Mission. |
| Identité, mission, réponse | Une introduction unique sous le film, puis « Notre réponse ». Pages « Le projet » et Mission conservées. |
| Équiper, former, pérenniser | Trois cartes « Équiper les laboratoires », « Accompagner les encadreurs », « Faire durer l’apprentissage ». |
| Cinq phases | Bloc dépliable « Du diagnostic au suivi » ; diagnostic complet sur « Notre démarche ». |
| Résultats attendus | Trois objectifs de lecture rapide sur l’accueil ; vision stratégique détaillée sur « Notre impact ». |
| Équipe | Page « Le projet », bloc « L’équipe ». |
| Collecte et suivi | Bloc « Aller plus loin » : collecte, équipements, voyage, écoles, avant/après, expérience logistique, partenaires, témoignages, indicateurs. |

## Réécriture et disposition de l’accueil

- L’introduction et l’ancien bloc de citation ont été réunis en une présentation directe de LabCongo. L’ancre `#presentation` reste disponible, de même que les autres liens de sections.
- Les cinq repères du sommaire correspondent aux cinq sections principales. Les contenus complémentaires utilisent des intitulés, sans numérotation discontinue.
- Le laboratoire illustre l’environnement visé ; la manipulation d’instruments illustre leur utilité ; l’encadrement et les élèves illustrent les usages dans la démarche. L’image de mine a été retirée des cartes pédagogiques de l’accueil, mais reste sur la page Mission, à côté de son contexte professionnel.
- Chaque visuel est accompagné de sa mention d’illustration et de ses crédits. La photographie de classe est explicitement située au Cameroun, sans la présenter comme une intervention LabCongo en RDC.
- La vidéo de l’école vient après la démarche. Son texte décrit le but pédagogique du projet, sans annoncer de livraison ou d’installation réalisée. Son animation au défilement est conservée, avec un titre stable et une version fixe lorsque les animations sont réduites.
- Les résultats sont formulés comme des objectifs. Aucun chiffre d’activité, partenaire ou établissement supplémentaire n’a été créé.
- Le hero, la navigation principale et les modifications du film existant sont préservés. La palette reste dominée par le bleu, avec des repères jaunes et rouges.

## Choix éditoriaux

- **Modèle.** La présentation ne mentionne pas la collecte de matériel en Europe. Le site garde cette collecte, en Belgique et en France, comme l’un des moyens d’équiper les laboratoires. Le film, la page « Faire un don » et « Le parcours du matériel » sur la page « Notre démarche » en dépendent.
- **Constats.** La présentation ne donne que leurs titres. Les phrases qui les accompagnent ont été rédigées à partir des diapositives 1 et 2 ; elles sont à relire.
- **Chiffres de l’enjeu.** 37,9 % du PIB réel (ITIE-RDC 2023), ≈ 95 % d’effectifs congolais (Barrick/Kibali), 31 % de management congolais (Kamoa-Kakula, Ivanhoe Mines 2024). Ils sont repris avec leurs sources, sans vérification indépendante. Ce sont des chiffres de contexte : ils ne passent pas par `statistics.ts`, réservé aux résultats publiés de LabCongo.
- **Résultats attendus.** La page Impact conserve la vision détaillée de la présentation, dont « vers 40 à 50 % » de contribution du secteur minier au PIB. L’accueil privilégie les objectifs pédagogiques et d’accompagnement, sans reprendre cette projection macroéconomique. Les indicateurs de LabCongo restent « À documenter » tant qu’aucune intervention n’est publiée.
- **Vocabulaire.** « Gaps » est rendu par « écarts ». La dernière diapositive écrit « CongoLab » : le site utilise « LabCongo ».
- **Avancement.** Les phases sont présentées sans indiquer où en est l’association.
- **Images.** Trois images de la présentation sont publiées dans `public/images/presentation/`, avec la mention « Image d’illustration » : travaux pratiques, site minier, laboratoire scolaire. Elles ne montrent pas des actions de LabCongo.
- **Pied de page.** « ASBL créée à Kinshasa · Collecte de matériel en Belgique et en France ».

## Inchangé

Les fiches d’écoles, projets, partenaires, témoignages et actualités restent vides tant qu’elles ne sont pas validées. Les formulaires, la page « Faire un don », le fonctionnement de la carte et le film d’ouverture sont inchangés. La mention de l’expérience hospitalière de l’équipe vient du cahier des charges.

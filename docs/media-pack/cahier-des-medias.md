Parfait. Pour éviter de produire trop de médias inutiles, je te conseille de verrouiller d’abord un **pack visuel officiel LabCongo**. L’objectif est que Codex sache exactement quels fichiers il recevra et que toutes les scènes gardent les mêmes personnages, lieux et niveau de réalisme.

### Pack média recommandé

| # | Scène | Média | Durée / format | Usage |
|---|---|---|---|---|
| 01 | Centre scientifique en Europe | Vidéo | 6–8 s | Ouverture immersive |
| 02 | Entrée dans le laboratoire | Vidéo | 5–7 s | Transition extérieur → intérieur |
| 03 | Rencontre avec les laborantins | Vidéo | 6–8 s | Interaction humaine |
| 04 | Présentation du matériel inutilisé | Vidéo | 6–8 s | Microscope, verrerie, instruments |
| 05 | Gros plan matériel scientifique | Photo HD | 16:9 | Parallax / transition vers collecte |
| 06 | Conditionnement du matériel | Vidéo | 6–8 s | Mise en caisse |
| 07 | Caisses prêtes à partir | Photo HD | 16:9 | Transition vers logistique |
| 08 | Chargement du conteneur | Vidéo | 6–8 s | Collecte → transport |
| 09 | Conteneur / camion | 3D + éventuellement vidéo | GLB | Scroll interactif |
| 10 | Terminal portuaire | Vidéo | 6–8 s | Logistique internationale |
| 11 | Conteneur chargé sur le navire | Vidéo ou 3D | 5–7 s | Transition vers voyage |
| 12 | Navire en mer | Vidéo | 5–6 s | Départ vers l’Afrique |
| 13 | Europe → RDC | WebGL / carte | interactif | Pas besoin de vidéo |
| 14 | Arrivée et déchargement en RDC | Vidéo | 6–8 s | Retour aux humains |
| 15 | Transport vers l’école | Vidéo | 5–6 s | Transition |
| 16 | Salle de sciences avant | Photo réelle | HD | Preuve documentaire |
| 17 | Installation du matériel | Vidéo | 7–10 s | Transformation de la salle |
| 18 | Salle équipée après | Photo réelle | HD | Avant/après |
| 19 | Élèves découvrant le matériel | Vidéo | 8–10 s | Partie émotionnelle |
| 20 | Élève au microscope | Vidéo | 6–8 s | Climax final |
| 21 | Microscope / vue scientifique | 3D ou macro | 4–5 s | Transition finale LabCongo |

### Il nous faut surtout 3 catégories différentes

**1. Médias cinématographiques d’illustration**  
Ils servent à raconter le concept : arrivée en Europe, laboratoire, port, voyage, etc. Ceux-là peuvent être générés de façon photoréaliste.

**2. Médias documentaires réels**  
Pour les écoles réellement bénéficiaires, l’hôpital déjà équipé, les partenaires, les installations, les photos avant/après et les livraisons réelles, il faudra utiliser les **vraies photographies et vidéos du projet**. Elles ne doivent pas être remplacées par des images IA présentées comme authentiques.

**3. Modèles 3D**  
Je limiterais la 3D à environ cinq objets :

```text
microscope.glb
equipment-crate.glb
shipping-container.glb
cargo-ship.glb
truck.glb
```

Le reste doit paraître photographique.

### Les trois personnages doivent rester exactement les mêmes

C’est très important pour éviter l’effet « IA ».

Nous devons créer une petite **bible visuelle** :

```text
ÉQUIPE LABCONGO

Personnage A
Homme adulte
tenue professionnelle sobre

Personnage B
Homme adulte
tenue professionnelle différente

Personnage C
Femme adulte
tenue professionnelle sobre
```

Ils doivent conserver d’une vidéo à l’autre :

- le même visage ;
- la même coiffure ;
- la même morphologie ;
- les mêmes vêtements ;
- les mêmes chaussures ;
- approximativement le même âge.

Même principe pour le laboratoire européen : **un seul environnement de référence** pour les scènes 01 à 06.

### Il faut commencer par des photos de référence, puis faire les vidéos

Je ne commencerais pas directement par douze vidéos.

Ordre idéal :

```text
ÉTAPE 1

Créer une image officielle :
les 3 représentants devant le centre scientifique.

        ↓

ÉTAPE 2

Créer une image officielle :
les mêmes personnes dans le laboratoire.

        ↓

ÉTAPE 3

Créer une image :
les mêmes personnes avec les laborantins.

        ↓

ÉTAPE 4

Créer les images de référence :
matériel + caisses + conteneur.

        ↓

ÉTAPE 5

Valider le réalisme.

        ↓

ÉTAPE 6

Transformer ces références en vidéos.
```

Ça donnera beaucoup plus de cohérence.

### Niveau visuel à imposer

Je veux partir sur :

**photographie documentaire cinématographique**, pas « rendu 3D réaliste ».

Donc dans nos prompts, on insistera sur :

- proportions humaines naturelles ;
- textures de peau réalistes ;
- lumière naturelle ;
- vêtements crédibles ;
- imperfections normales ;
- laboratoire réellement utilisé ;
- matériel scientifique avec traces légères d’usage ;
- aucune peau plastique ;
- aucun décor futuriste ;
- pas de profondeur de champ exagérée ;
- pas de lumière publicitaire excessive ;
- caméra documentaire premium.

### Format à préparer pour Codex

Pour le site :

```text
public/media/experience/

01-europe-arrival/
    poster.webp
    desktop.webm
    desktop.mp4
    mobile.webm

02-laboratory-entry/
    poster.webp
    desktop.webm
    desktop.mp4
    mobile.webm

03-laboratory-meeting/
...

photos/
models/
textures/
```

Chaque vidéo aura également une **image poster** afin que le visiteur ne voie jamais un écran vide pendant le chargement.

### La première ressource à produire

Je commencerais par **l’image maître de la scène 01** :

> Un centre scientifique européen crédible, deux hommes et une femme de l’équipe LabCongo arrivant ensemble vers l’entrée, photographie documentaire premium, lumière naturelle, format 16:9, suffisamment d’espace autour des personnages pour permettre les mouvements de caméra et le recadrage du site.

Une fois **cette image et les trois personnages validés**, elle deviendra la référence de continuité pour toutes les autres scènes. Ensuite, nous produirons les visuels du laboratoire avant de passer aux vidéos.
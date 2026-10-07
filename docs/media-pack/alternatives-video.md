# Alternative au pilote Higgsfield — Runway

Recherche vérifiée le 5 octobre 2026. But : animer l’image maître déjà validée et conserver le rendu documentaire, les personnages et les mouvements physiques. Aucune image supplémentaire n’est nécessaire pour ce premier essai.

## Recommandation

Tester **Veo 3.1 Fast via Runway**, en image-vers-vidéo, 6 secondes, 1920 × 1080, sans son. C’est une proposition de test économique, pas une qualité déjà constatée sur les images LabCongo.

Runway propose également **Seedance 2.5**, le même modèle que celui prévu sur Higgsfield. Cette seconde voie conserve le choix de moteur initial. Dans les deux cas, vérifier le résultat réel avant de lancer d’autres scènes : stabilité des visages et tenues, marche, mains, direction vers la porte et géométrie du bâtiment.

## Tarifs API vérifiés

| Option | Calcul pour une image de départ et 6 secondes | Coût estimé par essai |
|---|---|---|
| Veo 3.1 Fast, sans son | 10 crédits/s × 6 × 0,01 USD | **0,60 USD** |
| Seedance 2.5, 1080p | 68 crédits/s × 6 × 0,01 USD ; image de référence sans supplément | **4,08 USD** |

Sources : [tarifs Runway Dev](https://docs.dev.runwayml.com/guides/pricing/), [modèles disponibles](https://docs.dev.runwayml.com/guides/models/), [contrat du SDK officiel image-vers-vidéo](https://github.com/runwayml/sdk-python/blob/main/src/runwayml/resources/image_to_video.py).

Ces prix sont ceux de **l’API Runway Dev**, hors taxes et nouvelles tentatives. Le démarrage de l’API demande un minimum de **10 USD de crédits prépayés**, selon le [guide de configuration](https://docs.dev.runwayml.com/guides/setup/). Le coût par essai n’est donc pas le montant minimal à payer pour ouvrir un compte API sans solde.

## Accès depuis cette conversation

L’intégration Runway a été trouvée dans le catalogue et proposée. Au moment de cette recherche, elle n’est ni installée ni connectée. Elle permet de générer à partir d’images et de consulter le compte une fois associée. Le modèle réellement accessible et le coût via cette intégration restent à vérifier après connexion ; ne pas assimiler ses crédits aux tarifs API du tableau.

L’accès Runway Dev est distinct de l’intégration de génération dans le chat, comme le précise la [documentation Runway Dev](https://docs.dev.runwayml.com/guides/mcp/). Les paramètres et le prompt du pilote sont préparés dans [pilot-runway-options.json](pilot-runway-options.json), mais aucune clé n’a été demandée ou lue, aucun compte créé, aucun achat effectué et aucun média transmis à Runway.

L’autorisation déjà donnée concernait Higgsfield. Le changement de destinataire et le coût du nouveau pilote devront être explicitement acceptés avant l’envoi.

## Autres possibilités vérifiées

- **Figma / Weave** : l’outil disponible répond que le compte Figma n’est pas lié à Weave. Aucun modèle ni coût utilisable n’a pu être confirmé pour ce compte.
- **Runway gratuit** : 125 crédits initiaux annoncés, modèles accessibles variables et filigrane sur les vidéos gratuites. Ce n’est pas une garantie d’accès gratuit au pilote choisi. [Détails officiels](https://help.runwayml.com/hc/en-us/articles/50404627334547-Free-plan-details).
- **Pika** : la page tarifaire actuelle indique zéro crédit mensuel pour le plan gratuit, avec achat de packs, et distingue les usages sous licence commerciale selon le plan. Cette piste ne résout pas automatiquement l’absence de crédit. [Tarifs officiels](https://pika.art/pricing).

## Préparation conservée

Réutiliser l’image maître, la bible de continuité et les six autres références. Après un pilote satisfaisant, préparer les fichiers MP4/WebM, les posters et les variantes mobiles, puis intégrer le défilement. Une animation de zoom sur une photographie ne produit pas les mouvements corporels attendus et ne constitue pas un remplacement équivalent de ce pilote.

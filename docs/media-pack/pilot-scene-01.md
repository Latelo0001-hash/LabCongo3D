# Essai vidéo — arrivée au centre scientifique

## Essai préparé

- Entrée : image maître validée `public/media/experience/01-europe-arrival/reference-v2.png`.
- Service : Higgsfield ; modèle Seedance 2.5.
- Sortie demandée : **une vidéo de 6 secondes, 16:9, 1080p, sans son**.
- Devis obtenu le 5 octobre 2026 : **72 crédits**. Aucun achat de crédits prévu.
- Intention : marche naturelle du trio vers la porte et léger déplacement latéral de caméra, sans changement de scène.

## État exact

L’utilisateur a explicitement autorisé l’envoi de l’image maître et le lancement de cet unique essai de 72 crédits (« Oui, envoyer l’image et lancer cet essai »). Le contrôle automatique d’approbation du transfert est donc résolu.

**L’image a été transférée à Higgsfield et confirmée.** Le fichier envoyé est une version WebP de mêmes dimensions ; la composition et le PNG original sont conservés. Les six autres références n’ont pas été envoyées.

Le devis final confirmait 72 crédits. La tentative de génération a été **rejetée avant création d’un job** avec le message `Requires plus plan or higher.` La lecture du compte a ensuite confirmé une formule **Starter**, **0,5 crédit disponible** et aucun essai illimité utilisable. Il n’y a donc ni vidéo générée, ni identifiant de job à suivre, ni dépense de crédits de génération pour ce pilote. Aucun achat ni changement d’abonnement n’a été effectué.

Pour reprendre, réutiliser l’image déjà confirmée et les paramètres enregistrés dans le JSON, après vérification de l’accès et du devis. L’autorisation de ce seul essai reste enregistrée ; elle ne couvre ni un achat, ni une série de vidéos, ni un coût supérieur à 72 crédits.

## Prompt final

```text
Animate the supplied approved master photograph as the first frame of one continuous six-second cinematic documentary shot. Keep EXACTLY the same three adult visitors throughout: the older man in navy blazer, white shirt and charcoal trousers; the younger man in charcoal overshirt, light-blue shirt and beige chinos; the woman with low bun, stone blazer, ivory blouse, navy trousers and black shoulder bag. Preserve their faces, hair, facial hair, body proportions, clothes, shoes and accessories frame to frame. Keep the same pale-stone and grey-glass European scientific centre, autumn trees and natural daylight.

0–1 seconds: begin with the approved image composition; subtle breathing, a quiet glance between colleagues and natural small hand movements.
1–4 seconds: the group takes a few relaxed, physically plausible steps and gently turns toward the glazed entrance on their right. Use a restrained lateral tracking movement to reveal their approach while keeping the three faces and the doorway readable. Their feet contact the pavement naturally and their bodies do not slide or float.
4–6 seconds: ease the camera movement as they approach the entrance. End outside, near the doorway, ready for the next scene. Do not jump into the laboratory or attempt a scene change in this clip.

One coherent eye-level documentary camera, roughly 35 mm optics, moderate depth of field, subtle motion, realistic skin and clothing, stable building geometry. No cuts, dissolves, time skips, fast zoom, dramatic orbit, sudden lighting changes, duplicated people, identity drift, extra limbs, logos, titles, subtitles or watermark. No music, speech or generated audio. This is an illustrative fictional scene for a website, not footage of a real LabCongo visit.
```

## Contrôle après génération

Examiner le clip complet et plusieurs images réparties dans le temps : visages et vêtements stables, démarche naturelle, pieds au sol, mains plausibles, bâtiment et direction de marche cohérents. Vérifier la durée, la résolution et l’absence de son, puis l’adaptation au défilement. Lancer les autres clips seulement après évaluation de ce pilote.

Les posters, exports WebM et MP4, variantes mobiles et images de repli seront préparés à partir du résultat retenu. Le fichier `pilot-v1.mp4` indiqué dans la requête est une destination prévue, pas un fichier déjà créé.

[Paramètres préparés](pilot-scene-01.json) · [Galerie des images fixes](revue.html)

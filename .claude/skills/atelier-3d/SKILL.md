---
name: atelier-3d
description: Règles et méthode pour modifier la scène 3D de l'accueil du portfolio (le « comptoir des mots » : atelier abricot, robot artisan qui range des mots-clés sur une étagère). À charger avant toute modification de js/comptoir.js, css/comptoir.css ou du haut de page d'index.html : décor, robot, lumière, qualité de rendu, animations, cadrage, version téléphone, captures de vérification.
---

# Atelier 3D de l'accueil

La scène du haut de page est en Three.js (0.170, importmap dans `index.html`) et GSAP 3.12.5. Tout est dans `js/comptoir.js` (module) et `css/comptoir.css`. Les mots-clés viennent de `window.CONTENT[lang].hero.words` (`js/content.js`, FR et EN, même ordre que les pictogrammes de `drawIcon`).

## Règles qui ne bougent pas

1. **Le texte d'abord.** Le robot et la scène ne passent jamais devant le nom, la phrase, le bouton CV. Le calcul est dans `resize()` : la caméra se décale (`setViewOffset`) puis recule si la scène sort à droite. Tout nouvel objet loin à droite doit être ajouté aux points testés (`sceneRight`, `deskRight`). Un voile crème (`.comptoir-veil`) garde le texte lisible : ne pas le retirer, ne pas mettre d'objet chargé derrière le texte.
2. **Pas de vide.** Le mur (`WALL_Z = SHELF_Z - .32`) est juste derrière l'étagère des mots. Tout objet est posé sur une surface (comptoir, plateau, bureau) ou fixé au mur. Rien ne flotte, rien ne se chevauche (vérifier les largeurs : étagère x −0,12 → 3,42 ; bureau `DESK`).
3. **Palette Abricot.** Constantes `P` en tête de fichier : mur `#EFCFB6`, bois `#B98A62`, robot terre cuite `#C8663F`, accent brique `#C2381F`, encre `#2A211C`. Boîtes : `COLORS`. Pas de bleu-gris, pas de noir pur.
4. **Robot artisan.** Silhouette cube terre cuite, peinture laquée (`MeshPhysicalMaterial` avec `clearcoat`), écran-visière, yeux dessinés sur `eyeTex` avec des humeurs (`setMood` : neutral, focus, happy, surprise), antenne et voyant lumineux. Pas de tablier, pas de plaque sur la tête (refusés par le propriétaire du site).
5. **Pas de glyphes Unicode** comme icônes : les pictogrammes sont dessinés au canvas.
6. **Accessibilité.** `prefers-reduced-motion` : étagère déjà remplie, rien ne bouge. La région `#comptoir-live` annonce les mots. La scène est `aria-hidden`.

## Qualité et performance

- `LITE` (largeur < 760 px ou écran tactile) : pas de post-traitement, densité de pixels 1,5, animations du décor ralenties ou coupées (vapeur, logs plus lents).
- `HQ` (ordi, sauf `?lq`) : ombres de contact `GTAOPass`, lissage `SMAAPass`, flou de profondeur `BokehPass` qui suit le robot, halo `UnrealBloomPass` discret (force ≈ 0,18), lumière de fenêtre `RectAreaLight`, bois veiné, mur en enduit, parquet.
- Garder la brume légère (Fog 16 → 40) et le halo faible : au-delà, l'image devient laiteuse.
- La scène ne se redessine pas hors de l'écran (`IntersectionObserver`). Ne pas casser ce garde-fou.
- Les textures canvas se dessinent après le chargement des polices (`redraw()` en fin de fichier) : toute nouvelle texture texte doit y être ajoutée.

## Vérifier avant de montrer

Serveur local : `.claude/launch.json`, configuration `site` (port 8765).

- **Captures fiables** (le panneau navigateur peut être masqué) : Edge sans fenêtre, avec `?demo=5` qui fige la scène (5 mots rangés, le 6e sur le comptoir) :
  `msedge --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader --hide-scrollbars --window-size=1440,900 --virtual-time-budget=9000 --screenshot=<fichier> "http://localhost:8765/index.html?lang=fr&demo=5"`
  Faire aussi 1100×760 (largeur moyenne) et 500×1000 (téléphone ; le mode sans fenêtre impose ~500 px minimum).
- **Comparer avant / après** au même cadrage : rognage et empilement avec FFmpeg (`crop`, `vstack`), puis envoyer l'image.
- **Tester la boucle** quand le panneau est masqué : dans la console, faire avancer GSAP à la main (`gsap.ticker.tick()` en boucle par paquets de 25–30 s) et suivre `#comptoir-live` ; attendre les 8 mots puis la pause café, sans erreur.
- `--force-prefers-reduced-motion` pour vérifier la version sans animation.

## Façon de travailler avec le propriétaire

Proposer 2 pistes avec leurs compromis pour chaque décision visuelle et le laisser choisir. Montrer un exemple ou une comparaison plutôt qu'une description quand il ne voit pas la différence. Coder sur une branche, ouvrir une PR (`gh`), et lui laisser la validation.

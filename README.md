# Portfolio — Adrien-Matéo Soules

Site statique (HTML/CSS/JS), bilingue FR/EN, prévu pour GitHub Pages.

## Structure

```
index.html        squelette de la page
css/style.css     mise en forme
js/content.js     TOUS les textes, en FR et en EN  ← le fichier à modifier
js/main.js        langue, rendu des sections, démo interactive
assets/           photo, CV (à ajouter)
.nojekyll         dit à GitHub Pages de servir les fichiers tels quels
```

## À compléter avant la mise en ligne

Les zones encadrées en orange pointillé sur le site sont à remplir.

1. `assets/photo.jpg` puis, dans `index.html`, remplacer le bloc `portrait-placeholder` par
   `<img src="assets/photo.jpg" alt="Portrait d'Adrien-Matéo Soules">`
2. `assets/cv-fr.pdf` et `assets/cv-en.pdf`
3. En haut de `js/content.js` : e-mail et URL LinkedIn
4. Dans `js/content.js` : dates d'expérience, spécialité du DUT, certifications, section Méthode
5. Captures des réalisations (puis retirer les lignes `todo`)

## Mise en ligne sur GitHub Pages

1. Créer un dépôt public sur GitHub (ex. `portfolio`).
2. Déposer tout le contenu de ce dossier à la racine du dépôt (Add file → Upload files).
3. Settings → Pages → Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.
   Le site est en ligne sur `https://<ton-pseudo>.github.io/portfolio/`.

## Brancher le nom de domaine (OVH)

1. GitHub : Settings → Pages → Custom domain → saisir le domaine (ex. `adrienmateo-soules.com`).
   GitHub crée un fichier `CNAME` dans le dépôt.
2. OVH : Domaine → Zone DNS. Supprimer les anciens enregistrements A / AAAA du domaine nu et de `www`, puis ajouter :

| Type  | Sous-domaine | Cible                     |
|-------|--------------|---------------------------|
| A     | (vide)       | 185.199.108.153           |
| A     | (vide)       | 185.199.109.153           |
| A     | (vide)       | 185.199.110.153           |
| A     | (vide)       | 185.199.111.153           |
| CNAME | www          | `<ton-pseudo>.github.io.` |

3. Attendre la propagation (quelques minutes à quelques heures), puis cocher « Enforce HTTPS » dans Settings → Pages.

## Partager la bonne langue

- Version française : `https://<domaine>/?lang=fr`
- Version anglaise : `https://<domaine>/?lang=en`

Sans paramètre, le site s'ouvre dans la langue du navigateur du visiteur.

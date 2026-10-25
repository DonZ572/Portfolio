# Portfolio — Donatien Zinsou

Portfolio personnel : cybersécurité & communication digitale.
À la recherche d'une **alternance de 33 mois à partir de septembre 2026** (Pré-Master Cybersécurité, Epitech).

**Site en ligne : https://donz572.github.io/Portfolio/**

## Contenu

- **Accueil** : accroche, photo, objectif d'alternance, contact rapide
- **Réalisations** : GestizApp et Postuly (en ligne), et trois projets web académiques détaillés sur leur propre page
- **Parcours** : expériences professionnelles, associatives et événements
- **Savoir-faire** : développement web, sécurité, données & cloud, gestion de projet
- **Progression** : ce que chaque projet m'a appris et ce qu'il me reste à travailler
- **Formation**, **centres d'intérêt**, **coordonnées et formulaire de contact**

## Technologies et choix

- **HTML, CSS et JavaScript natifs** : aucune dépendance, rien à installer ni à compiler. Le site est assez petit (4 pages)
  pour qu'un framework ou une étape de build n'apporte pas de bénéfice, et chaque ligne est maîtrisée.
- **CSS** : variables CSS pour les couleurs et polices, mise en page en Grid et Flexbox, responsive par media queries.
- **Formulaire** : API REST d'EmailJS appelée avec `fetch` (un site statique n'a pas de serveur pour envoyer des e-mails).
- **Hébergement** : GitHub Pages.

## Fonctionnalités

- Design responsive (ordinateur, tablette, mobile)
- Accessibilité : textes alternatifs, titres hiérarchisés, navigation au clavier, respect du réglage « réduire les animations »
- SEO : titre et description par page, URL canonique, aperçu de partage (Open Graph), `sitemap.xml`, `robots.txt`
- Terminal de commandes : appuyez sur `/` puis tapez `projets`, `progression`, `contact`, `cv`, `nb`, `negatif`…
- Formulaire de contact avec protection anti-robots (champ piège)

## Structure

```
index.html                page principale
projects/voyages.html     projet Plateforme Voyages
projects/hotel.html       projet Réservation Hôtel
projects/ecole.html       projet Site de l'école
assets/Css/studio.css     feuille de style unique
assets/js/studio.js       interactions (menu, terminal, animations, formulaire)
assets/img/               photo, captures des projets, icône
assets/cv/cv.pdf          CV téléchargeable
sitemap.xml, robots.txt   référencement
```

## Lancer en local

Ouvrir `index.html` dans un navigateur. Aucune installation n'est nécessaire.

## Publication (automatique)

Le site est publié par **GitHub Pages** depuis la branche `main`, dossier racine
(**Settings → Pages → Deploy from a branch → `main` / `(root)`**).
Chaque `git push` sur `main` met le site en ligne automatiquement, sans étape manuelle, en une à deux minutes.

## Crédits

- Polices : [Anton](https://fonts.google.com/specimen/Anton), [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
  et [Space Mono](https://fonts.google.com/specimen/Space+Mono), via Google Fonts, sous licence SIL Open Font License
- Photo de profil et captures d'écran des projets : réalisations personnelles
- Direction artistique inspirée du studio [ToyFight](https://toyfight.co/)
- Envoi des messages : [EmailJS](https://www.emailjs.com/)

## Contact

- E-mail : donatien.zinsou24@audencia.com
- LinkedIn : https://www.linkedin.com/in/donatien-zinsou/
- GitHub : https://github.com/DonZ572

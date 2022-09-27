
# Kaliop Player/Playlist

## Installation

Le player est construit sur la base de VueJs, il faut donc commencer par ajouter au projet les modules npm suivants :

```
npm install vue vue-loader vue-template-compiler
```

et ajouter à la config webpack (fichier webpack.common.js) les lignes suivantes :

```
const VueLoaderPlugin = require('vue-loader/lib/plugin')
```

```
module: {
  rules: [
    ...
    {
      test: /\.vue$/  ,
      loader: 'vue-loader'
    }
  ]
},
```

```
plugins: [
  ...
  new VueLoaderPlugin()
]
```

puis il faut importer et initialiser le fichier 'kaliopMediaPlayerHandler.js' à la fin du ficher index.js qui sera compilé par webpack :

```
import kaliopMediaPlayerHandler from './components/mediaplayer/kaliopMediaPlayerHandler';
kaliopMediaPlayerHandler.init();
```

## Utilisation

### Création du composant HTML Playlist :

1. Créer un container ayant l'attribut "data-kaliop-player"
2. L'attribut "data-kaliop-player" devra contenir les données utiles au bon fonctionnement du player au format JSON
3. Dans ce container, il faut créer une div correspondant à chaque fonctionnalité (widget) du player comme dans l'exemple ci-dessous :


```
<div data-kaliop-player="{{ playerData }}">
  <div data-vue-widget="kaliop-player-player"></div>
  <div data-vue-widget="kaliop-player-controls"></div>
  <div data-vue-widget="kaliop-player-infos"></div>
  <div data-vue-widget="kaliop-player-description"></div>
  <div data-vue-widget="kaliop-player-transcription"></div>
  <div data-vue-widget="kaliop-player-autoplay"></div>
  <div data-vue-widget="kaliop-player-playlist"></div>
</div>
```

### Utilisation avancée du composant Playlist

Pour que le composant fonctionne, seul le widget "player" est obligatoire, tous les autres widgets sont optionnels et peuvent être utilisés indépendament les uns des autres.

Le markup au sein du container "data-kaliop-player" est libre.

Chaque widget peut être disposé librement à l'intérieur comme dans l'exemple ci-dessous :

```
<section class="VideoPlayer" data-kaliop-player="{{ playerData }}">
  <div class="VideoPlayer-content">
    <div class="VideoPlayer-player">
      <div data-vue-widget="kaliop-player-player"></div>
      <ul class="VideoPlayer-accordion" data-player-accordion>
        <li class="VideoPlayer-accordionItem" data-accordion-item>
          <a href="#" class="VideoPlayer-infos">
            <div data-vue-widget="kaliop-player-infos"></div>
          </a>
          <div class="VideoPlayer-description" data-tab-content>
            <div data-vue-widget="kaliop-player-description"></div>
          </div>
          <div class="VideoPlayer-transcription">
            <div data-vue-widget="kaliop-player-transcription"></div>
          </div>
        </li>
      </ul>
    </div>
    {% if is_playlist ?? true %}
      <div class="VideoPlayer-playlist">
        <div data-vue-widget="kaliop-player-autoplay"></div>
        <div data-vue-widget="kaliop-player-playlist"></div>
      </div>
    {% endif %}
  </div>
</section>
```

## Structure de données

Comme indiqué dans la partie précédente, le player utilise des données au format JSON.
Vous trouverez un exemple de JSON ici : [Exemple JSON](example.json)

Ces données sont découpées en 3 parties principales :

- medias: tableau de médias (requis)
- options: liste des options permettant de configurer le player (optionnel)
- labels: liste de labels pour surcharger les textes par défaut (optionnel)

### Medias

Chaque media est constitué des propriétés suivantes :

| PROPRIÉTE         | TYPE                                                          | REQUIS |
|-------------------|---------------------------------------------------------------|--------|
| id                | String ou Int                                                 | Oui    |
| media_sources*    | Array: [{ src: String, type: String }, ...]                   | Oui    |
| title             | String                                                        | Non    |
| description       | String (html)                                                 | Non    |
| image             | Object: { src: String, alt: String }                          | Non    |
| date              | String                                                        | Non    |
| author            | String                                                        | Non    |
| duration          | String                                                        | Non    |
| transcription_url | String                                                        | Non    |
| subtitles**       | Array: [{ label: String, srcLang: String, src: String }, ...] | Non    |

*Un média peut contenir plusieurs sources pour la compatibilité navigateur.

**Chaque sous-titre correspond à une langue, "srcLang" est le code de la langue du sous-titre

### Options

Liste des options disponibles :

| OPTION                  | TYPE    | VALEUR PAR DÉFAUT                                        | DESCRIPTION                                                          |
|-------------------------|---------|----------------------------------------------------------|----------------------------------------------------------------------|
| mediaType               | String  | video                                                    | Définit le type de lecteur à afficher (vidéo/audio)                  |
| autoplay                | Boolean | false                                                    | Définit si la lecture automatique est activée par défaut             |
| descriptionOnPreview    | Boolean | false                                                    | Affiche la description du média dans les éléments de la playlist     |
| authorOnPreview         | Boolean | false                                                    | Affiche le nom de l'auteur du média dans les éléments de la playlist |
| playButton*             | Object  | Object: { isVisible: Boolean, hasIcon: Boolean }         | Si "isVisible" = true, affiche le bouton de lecture avec l'image de poster par dessus le player. Si "hasIcon" = true, affiche une icone "play" |
| controlsList            | Object  | Object: { nodownload: Boolean, noplaybackrate: Boolean } | |
| disablePictureInPicture | Boolean | false                                                    |  |

*Cette option est utilisable uniquement pour les média type "vidéo"

### Labels

Liste des labels des éléments du player

| LABEL              | VALEUR PAR DÉFAUT   |
|--------------------|---------------------|
| transcriptionLabel | Transcription       |
| previousMediaLabel | Précédent           |
| nextMediaLabel     | Suivant             |
| autoplayTitle      | Vidéos à suivre     |
| autoplayLabel      | Lecture automatique |

## Définition des widgets

### Player

Affiche un player HTML5 permettant la lecture des éléments de la playlist (vidéo/audio). Par défaut, le premier élément de la playlist est chargé à l'ouverture de la page.

### Infos

Affiche les infos liées au média courant :

- Titre
- Date
- Auteur
- Durée

### Description

Affiche la description du média courant

### Transcription

Affiche le bouton permettant d'accéder à la transcription du média courant

### Controls

Affiche les boutons permettant de passer au média suivant/précédent

### Autoplay

Affiche le bloc lecture automatique indiquand le numéro du média courant et le bouton pour activer/désactiver la lecture automatique

### Playlist

Affiche la liste des médias de la playlist avec leur titre, image et durée. Au clic sur un média dans la playlist, lance la lecture de ce dernier.

import Vue from 'vue'

import Player from './Player.vue'
import Infos from './Infos.vue'
import Description from './Description.vue'
import Transcription from './Transcription.vue'
import Playlist from './Playlist.vue'
import Controls from './Controls.vue'
import Autoplay from './Autoplay.vue'

Vue.config.devtools = true


let self = {}

self.init = function() {
  // Init player for each player on the current page
  document.querySelectorAll('[data-kaliop-player]').forEach((mediaContainer) => {

    // Create eventBus to centralize event transmission between component
    const eventBus = new Vue()

    const data = JSON.parse(mediaContainer.getAttribute('data-kaliop-player'))

    mountPlayer(mediaContainer, data, eventBus)
    mountInfo(mediaContainer, data, eventBus)
    mountDescription(mediaContainer, data, eventBus)
    mountTranscription(mediaContainer, data, eventBus)
    mountPlaylist(mediaContainer, data, eventBus)
    mountControls(mediaContainer, data, eventBus)
    mountAutoplay(mediaContainer, data, eventBus)
  })
}

function mountPlayer(mediaContainer, data, eventBus) {
  const playerPlayerNode = mediaContainer.querySelector('[data-vue-widget="kaliop-player-player"]')

  if(!playerPlayerNode) return

  const firstMedia = data.medias[0]
  const options = data.options !== undefined ? data.options : {}

  let propsPlayer = {
    eventBus: eventBus,
    mediaType: options.mediaType,
    originMedias: data.medias,
    originMediaSources: firstMedia.media_sources,
    originMediaPoster: firstMedia.image,
    originSubtitles: firstMedia.subtitles,
    originAutoplay: options.autoplay,
    playButton: options.playButton
  }

  new Vue({
    render: h => h(Player, { props: propsPlayer })
  }).$mount(playerPlayerNode)
}

function mountInfo(mediaContainer, data, eventBus) {
  const playerInfosNode = mediaContainer.querySelector('[data-vue-widget="kaliop-player-infos"]')

  if(!playerInfosNode) return

  const firstMedia = data.medias[0]

  let propsInfos = {
    eventBus: eventBus,
    originTitle: firstMedia.title,
    originDate: firstMedia.date,
    originDuration: firstMedia.duration,
    originAuthor: firstMedia.author
  }

  new Vue({
    render: h => h(Infos, { props: propsInfos })
  }).$mount(playerInfosNode)
}

function mountDescription(mediaContainer, data, eventBus) {
  const playerDescriptionNode = mediaContainer.querySelector('[data-vue-widget="kaliop-player-description"]')

  if(!playerDescriptionNode) return

  const firstMedia = data.medias[0]

  let propsDescription = {
    eventBus: eventBus,
    originDescription: firstMedia.description
  }

  new Vue({
    render: h => h(Description, { props: propsDescription })
  }).$mount(playerDescriptionNode)
}

function mountTranscription(mediaContainer, data, eventBus) {
  const playerTranscriptionNode = mediaContainer.querySelector('[data-vue-widget="kaliop-player-transcription"]')

  if(!playerTranscriptionNode) return

  const firstMedia = data.medias[0]
  const labels = data.labels !== undefined ? data.labels : {}

  let propsTranscription = {
    eventBus: eventBus,
    originTranscriptionUrl: firstMedia.transcription_url,
    transcriptionLabel: labels.transcriptionLabel
  }

  new Vue({
    render: h => h(Transcription, { props: propsTranscription })
  }).$mount(playerTranscriptionNode)
}

function mountPlaylist(mediaContainer, data, eventBus) {
  const playerPlaylistNode = mediaContainer.querySelector('[data-vue-widget="kaliop-player-playlist"]')

  if(!playerPlaylistNode) return

  const options = data.options !== undefined ? data.options : {}

  let propsPlaylist = {
    eventBus: eventBus,
    originMedias: data.medias,
    descriptionOnPreview: options.descriptionOnPreview,
    dateOnPreview: options.dateOnPreview
  }

  new Vue({
    render: h => h(Playlist, { props: propsPlaylist })
  }).$mount(playerPlaylistNode)
}

function mountControls(mediaContainer, data, eventBus) {
  const playerControlsNode = mediaContainer.querySelector('[data-vue-widget="kaliop-player-controls"]')

  if(!playerControlsNode) return

  const labels = data.labels !== undefined ? data.labels : {}

  let propsControls = {
    eventBus: eventBus,
    previousMediaLabel: labels.previousMediaLabel,
    nextMediaLabel: labels.nextMediaLabel,
    originIsLastMedia: data.medias.length === 1 ? true : false
  }

  new Vue({
    render: h => h(Controls, { props: propsControls })
  }).$mount(playerControlsNode)
}

function mountAutoplay(mediaContainer, data, eventBus) {
  const playerAutoplayNode = mediaContainer.querySelector('[data-vue-widget="kaliop-player-autoplay"]')

  if(!playerAutoplayNode) return

  const options = data.options !== undefined ? data.options : {}
  const labels = data.labels !== undefined ? data.labels : {}

  let propsAutoplay = {
    eventBus: eventBus,
    mediasLength: data.medias.length,
    originAutoplay: options.autoplay,
    autoplayTitle: labels.autoplayTitle,
    autoplayLabel: labels.autoplayLabel
  }

  new Vue({
    render: h => h(Autoplay, { props: propsAutoplay })
  }).$mount(playerAutoplayNode)
}

export default self

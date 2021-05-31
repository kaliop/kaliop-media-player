<template>
  <div class="KaliopPlayer-player" :class="{'is-playing': isPlaying }" :data-current-media-index="currentMediaIndex">
    <button class="KaliopPlayer-playerButton" v-if="mediaType === 'video' && playButton.isVisible" @click="playMedia">
      <img v-if="mediaPoster" :src="mediaPoster.src" :alt="mediaPosterAlt">
      <svg v-if="playButton.hasIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.833 0 0 114.844 0 256s114.833 256 256 256 256-114.844 256-256S397.167 0 256 0zm101.771 264.969l-149.333 96c-1.75 1.135-3.771 1.698-5.771 1.698-1.75 0-3.521-.438-5.104-1.302C194.125 359.49 192 355.906 192 352V160c0-3.906 2.125-7.49 5.563-9.365 3.375-1.854 7.604-1.74 10.875.396l149.333 96c3.042 1.958 4.896 5.344 4.896 8.969s-1.854 7.01-4.896 8.969z"/></svg>
    </button>
    <video v-if="mediaType === 'video'" class="KaliopPlayer-mediaPlayer" data-kaliop-player-mediaPlayer controls >
      <source v-for="(source, index) in mediaSources" :key="`source-${index}`" :src="source.src" :type="source.type ? source.type : ''">
      <track
        v-for="(subtitle, index) in mediaSubtitles" :key="`subtitle-${index}`"
        :label="subtitle.label ? subtitle.label : ''"
        :srclang="subtitle.srcLang ? subtitle.srcLang : ''"
        :src="subtitle.src"
        kind="subtitles"
      >
    </video>
    <audio v-else-if="mediaType === 'audio'" class="KaliopPlayer-mediaPlayer" data-kaliop-player-mediaPlayer controls >
      <source v-for="(source, index) in mediaSources" :key="`source-${index}`" :src="source.src" :type="source.type ? source.type : ''">
    </audio>
  </div>
</template>

<script>
  export default {
    name: 'Player',
    props: {
      eventBus: {
        required: true,
        type: Object
      },
      mediaType: {
        required: false,
        type: String,
        default: 'video'
      },
      originMedias: {
        required: true,
        type: Array
      },
      originMediaSources: {
        required: true,
        type: Array
      },
      originMediaPoster: {
        required: true,
        type: Object
      },
      originSubtitles: {
        required: false,
        type: Array
      },
      originAutoplay: {
        required: false,
        type: Boolean,
        default: false
      },
      playButton: {
        required: false,
        type: Object,
        default: function() {
          return {
            isVisible: false,
            hasIcon: false
          }
        }
      }
    },
    data() {
      return {
        medias: [],
        currentMediaIndex: '',
        mediaSources: [],
        mediaPoster: {},
        mediaSubtitles: [],
        isPlaying: false,
        autoplay: false,
        mediaNode: null
      }
    },
    computed: {
      mediaPosterAlt: function() {
        if (this.medias[this.currentMediaIndex]) {
          return `Lancer la vidéo : ${this.medias[this.currentMediaIndex].title}`
        }

        return ''
      }
    },
    methods: {
      playMedia() {
        this.mediaNode.play()
        this.isPlaying = true
      },
      // Preload current media
      loadMedia() {
        this.mediaNode.load()
        this.mediaNode.addEventListener('loadeddata', () => {
          this.playMedia()
        })
      },
      // Play next media if autoplay is enabled
      mediaEnded() {
        this.mediaNode.addEventListener('ended', () => {
          if (this.autoplay) {
            this.updateMedia(this.currentMediaIndex + 1)
          }
        })
      },
      // Change current media and send new media to other widgets
      updateMedia(mediaIndex) {
        if (this.medias[mediaIndex] !== undefined) {
          this.eventBus.$emit('Player::UpdateMedia', {index: mediaIndex, media: this.medias[mediaIndex]})
          this.updatePlayer(this.medias[mediaIndex], mediaIndex)
          this.checkCurrentMedia()
        }
      },
      // Update media data with new one
      updatePlayer(media, index) {
        this.currentMediaIndex = index
        this.mediaSources = media.media_sources
        this.mediaPoster = media.image
        this.mediaSubtitles = media.subtitles
        this.loadMedia()
      },
      // Check if the current is first or last and notify Controls widget
      checkCurrentMedia() {
        if (this.medias[this.currentMediaIndex - 1] === undefined) {
          this.eventBus.$emit('Player::IsFirstMedia')
        }

        if (this.medias[this.currentMediaIndex + 1] === undefined) {
          this.eventBus.$emit('Player::IsLastMedia')
        }
      }
    },
    mounted() {
      this.medias = this.originMedias
      this.currentMediaIndex = 0
      this.mediaSources = this.originMediaSources
      this.mediaPoster = this.originMediaPoster
      this.mediaSubtitles = this.originSubtitles
      this.autoplay = this.originAutoplay
      this.mediaNode = this.$el.querySelector('[data-kaliop-player-mediaPlayer]')

      // Add event listener on media ended
      this.mediaEnded()

      this.eventBus.$on('Playlist::UpdateMedia', (index) => {
        this.updateMedia(index)
      })

      this.eventBus.$on('Controls::PreviousMedia', () => {
        this.updateMedia(this.currentMediaIndex - 1)
      })

      this.eventBus.$on('Controls::NextMedia', () => {
        this.updateMedia(this.currentMediaIndex + 1)
      })

      this.eventBus.$on('Autoplay::AutoplayState', (state) => {
        this.autoplay = state
      })
    },
  }
</script>

<style lang="scss" scoped>
  .KaliopPlayer-player {
    position: relative;

    &.is-playing {
      .KaliopPlayer-playerButton {
        visibility: hidden;
      }
    }
  }

  .KaliopPlayer-playerButton {
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    svg {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 75px;
      height: 75px;
      transform: translate(-50%, -50%);
    }
  }

  .KaliopPlayer-mediaPlayer {
    display: block;
  }
</style>

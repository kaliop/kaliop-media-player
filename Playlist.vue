<template>
  <ul class="KaliopPlayer-playlist">
    <li class="KaliopPlayer-playlistItem" :class="{ 'is-active' : currentMediaIndex == index }" v-for="(media, index) in medias" :key="media.id">
      <button class="KaliopPlayer-playlistButton" @click="updateMedia(index)" :aria-current="currentMediaIndex == index ? true : false" :disabled="currentMediaIndex == index ? true : false">
        <header class="KaliopPlayer-playlistButtonHeader">
          <img class="KaliopPlayer-playlistButtonImage" :src="media.image.src" :alt="media.image.alt">
        </header>
        <main class="KaliopPlayer-playlistButtonContent">
          <span class="KaliopPlayer-playlistButtonTitle">{{ media.title }}</span>
          <span class="KaliopPlayer-playlistButtonDuration">{{ media.duration }}</span>
          <div class="KaliopPlayer-playlistButtonDate" v-if="dateOnPreview">{{ media.date }}</div>
          <div class="KaliopPlayer-playlistButtonDescription" v-if="descriptionOnPreview" v-html="media.description"></div>
        </main>
      </button>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'Playlist',
    props: {
      eventBus: {
        required: true,
        type: Object
      },
      originMedias: {
        required: true,
        type: Array
      },
      descriptionOnPreview: {
        required: false,
        type: Boolean,
        default: false
      },
      dateOnPreview: {
        required: false,
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        medias: [],
        currentMediaIndex: ''
      }
    },
    methods: {
      // Notify the player to change the current media on click on playlist element
      updateMedia(mediaIndex) {
        if (this.medias[mediaIndex] !== undefined) {
          this.eventBus.$emit('Playlist::UpdateMedia', mediaIndex)
        }
      }
    },
    mounted() {
      this.medias = this.originMedias
      this.currentMediaIndex = 0

      this.eventBus.$on('Player::UpdateMedia', ({ index } = payload) => {
        this.currentMediaIndex = index
      })
    }
  }
</script>

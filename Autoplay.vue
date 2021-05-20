<template>
  <div class="KaliopPlayer-autoplay">
    <span class="KaliopPlayer-autoplayTitle">{{ autoplayTitle }}</span>
    <div class="KaliopPlayer-autoplayCounter"><span>{{ currentMedia }}</span>/<span>{{ mediasLength }}</span></div>
    <div class="KaliopPlayer-autoplayToggle">
      <label for="kaliopplayer-autoplay">
        <input type="checkbox" name="kaliopplayer-autoplay" id="kaliopplayer-autoplay" v-model="autoplay">
        {{ autoplayLabel }}
        <span></span>
      </label>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Autoplay',
    props: {
      eventBus: {
        required: true,
        type: Object
      },
      mediasLength: {
        required: true,
        type: Number
      },
      originAutoplay: {
        required: false,
        type: Boolean,
        default: false
      },
      autoplayTitle: {
        required: false,
        type: String,
        default: 'Vidéos à suivre'
      },
      autoplayLabel: {
        required: false,
        type: String,
        default: 'Lecture automatique'
      }
    },
    data() {
      return {
        currentMedia: 1,
        autoplay: false
      }
    },
    methods: {
      // Call when updating autoplay value to notify media player
      autoplayUpdate(val, oldVal) {
        this.eventBus.$emit('Autoplay::AutoplayState', val)
      }
    },
    watch: {
      autoplay: 'autoplayUpdate'
    },
    mounted() {
      this.autoplay = this.originAutoplay

      // Update current media index
      this.eventBus.$on('Player::UpdateMedia', ({ index } = payload) => {
        this.currentMedia = index + 1
      })
    },
  }
</script>

<template>
  <a class="KaliopPlayer-transcription" v-if="transcriptionUrl" :href="transcriptionUrl" target="_blank" rel="nofollow">{{ transcriptionLabel }}</a>
</template>

<script>
  export default {
    name: 'Transcription',
    props: {
      eventBus: {
        required: true,
        type: Object
      },
      originTranscriptionUrl: {
        required: false,
        type: String
      },
      transcriptionLabel: {
        required: false,
        type: String,
        default: 'Transcription'
      },
    },
    data() {
      return {
        transcriptionUrl: ''
      }
    },
    mounted() {
      this.transcriptionUrl = this.originTranscriptionUrl

      this.eventBus.$on('Player::UpdateMedia', ({ media } = payload) => {
        this.transcriptionUrl = media.transcription_url
      })
    },
  }
</script>

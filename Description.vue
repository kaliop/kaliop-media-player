<template>
  <div class="KaliopPlayer-description" v-html="description"></div>
</template>

<script>

  export default {
    name: 'Description',
    props : {
      eventBus: {
        required: true,
        type: Object
      },
      originDescription: {
        required: false,
        type: String
      }
    },
    data() {
      return {
        description: ''
      }
    },
    mounted() {
      this.description = this.originDescription

      this.eventBus.$on('Player::UpdateMedia', ({ media } = payload) => {
        this.description = media.description
      })
    }
  }
</script>

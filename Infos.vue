<template>
  <div class="KaliopPlayer-infos">
    <p class="KaliopPlayer-infosTitle">{{ title }}</p>
    <span class="KaliopPlayer-infosDate">{{ date }}</span>
    <span class="KaliopPlayer-infosAuthor">{{ author }}</span>
    <span class="KaliopPlayer-infosDuration">{{ duration }}</span>
  </div>
</template>

<script>

  export default {
    name: 'Infos',
    props : {
      eventBus: {
        required: true,
        type: Object
      },
      originTitle: {
        required: true,
        type: String
      },
      originDate: {
        required: false,
        type: String
      },
      originDuration: {
        required: false,
        type: String
      },
      originAuthor: {
        required: false,
        type: String
      }
    },
    data() {
      return {
        title: '',
        date: '',
        duration: '',
        author: ''
      }
    },
    mounted() {
      this.title = this.originTitle
      this.date = this.originDate
      this.duration = this.originDuration
      this.author = this.originAuthor

      this.eventBus.$on('Player::UpdateMedia', ({ media } = payload) => {
        this.title = media.title
        this.date = media.date
        this.duration = media.duration
        this.author = media.author
      })
    },
  }
</script>

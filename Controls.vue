<template>
  <div class="Controls">
    <button class="Controls-button" @click="previousMedia" :disabled="isFirstMedia">{{ previousMediaLabel }}</button>
    <button class="Controls-button" @click="nextMedia" :disabled="isLastMedia">{{ nextMediaLabel }}</button>
  </div>
</template>

<script>
  export default {
    name: 'Controls',
    props: {
      eventBus: {
        required: true,
        type: Object
      },
      previousMediaLabel: {
        required: false,
        type: String,
        default: 'Précédent'
      },
      nextMediaLabel: {
        required: false,
        type: String,
        default: 'Suivant'
      },
      originIsLastMedia: {
        required: false,
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isFirstMedia: true,
        isLastMedia: false
      }
    },
    methods: {
      previousMedia() {
        this.eventBus.$emit('Controls::PreviousMedia')
      },
      nextMedia() {
        this.eventBus.$emit('Controls::NextMedia')
      }
    },
    mounted() {
      this.isLastMedia = this.originIsLastMedia

      // Reset controls buttons on media update
      this.eventBus.$on('Player::UpdateMedia', () => {
        this.isFirstMedia = false
        this.isLastMedia = false
      })

      // Disable prev button if current media is first
      this.eventBus.$on('Player::IsFirstMedia', () => {
        this.isFirstMedia = true
      })

      // Disable next button if current media is last
      this.eventBus.$on('Player::IsLastMedia', () => {
        this.isLastMedia = true
      })
    },
  }
</script>

<style lang="scss" scoped>
  .Controls-button[disabled] {
    cursor: initial;
  }
</style>

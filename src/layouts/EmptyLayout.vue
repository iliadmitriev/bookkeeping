<template>
  <v-main class="grey darken-2">
    <router-view />
  </v-main>
</template>


<script>
import messages from '@/utils/messages';

export default {
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || fbError.code)
    }
  }
}
</script>

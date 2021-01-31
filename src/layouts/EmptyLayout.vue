<template>
  <v-main>
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
      this.$message(messages[fbError.code] || fbError.code)
    }
  }
}
</script>

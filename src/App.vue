<template>
  <div id="app">
    <v-app>
      <component :is="layout">
        <router-view/>
      </component>
    </v-app>
  </div>
</template>

<script>
import EmptyLayout from '@/layouts/EmptyLayout'
import MainLayout from '@/layouts/MainLayout'

export default {
  computed: {
    // this.$route.meta - configured in
    // @/router/index.js
    layout() {
      return `${this.$route.meta.layout || 'empty'}-layout`
    }
  },
  components: {
    EmptyLayout, MainLayout
  }
}
</script>

<style lang="scss">

</style>

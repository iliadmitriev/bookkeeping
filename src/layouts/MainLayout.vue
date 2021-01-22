<template>
  <div>
    <loader v-if="loading" />
    <div v-else class="app-main-layout">

      <Navbar
        @click="isOpen = !isOpen"
      >
      </Navbar>

      <Sidebar v-model="isOpen" :key="info.locale"></Sidebar>

      <main class="app-content" :class="{'full': !isOpen}">
        <div class="app-page">
          <router-view/>
        </div>
      </main>

      <FloatButton :key="info.locale + 1"></FloatButton>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/app/Navbar";
import Sidebar from "@/components/app/Sidebar";
import FloatButton from "@/components/app/FloatButton";
import Loader from "@/components/app/Loader";
import {mapGetters} from 'vuex'
import messages from "@/utils/messages";

export default {
  name: 'MainLayout',
  data: () => ({
    isOpen: false,
    loading: true
  }),
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }
    this.loading = false
  },
  computed: {
    ...mapGetters(['info']),
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || fbError.code)
    }
  },
  components: {
    Loader,
    Navbar,
    Sidebar,
    FloatButton
  }
}
</script>

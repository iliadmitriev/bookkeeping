<template>
  <div>
    <loader v-if="loading" />
    <div v-else class="app-main-layout">

      <Navbar
        @click="isOpen = !isOpen"
      >
      </Navbar>

      <Sidebar v-model="isOpen"></Sidebar>

      <main class="app-content" :class="{'full': !isOpen}">
        <div class="app-page">
          <router-view/>
        </div>
      </main>

      <FloatButton></FloatButton>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/app/Navbar";
import Sidebar from "@/components/app/Sidebar";
import FloatButton from "@/components/app/FloatButton";
import Loader from "@/components/app/Loader";

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
  components: {
    Loader,
    Navbar,
    Sidebar,
    FloatButton
  }
}
</script>

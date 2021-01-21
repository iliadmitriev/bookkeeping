<template>
  <div class="app-main-layout">

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

</template>

<script>
import Navbar from "@/components/app/Navbar";
import Sidebar from "@/components/app/Sidebar";
import FloatButton from "@/components/app/FloatButton";

export default {
  name: 'MainLayout',
  data: () => ({
    isOpen: false
  }),
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }
  },
  components: {
    Navbar,
    Sidebar,
    FloatButton
  }
}
</script>

<template>
  <div>
    <loader v-if="loading"/>
    <div v-else class="app-main-layout">

      <Navbar
        @drawer="openDrawer"
      >
      </Navbar>

      <Sidebar
        :key="info.locale"
        :value="triggerDrawer"
      ></Sidebar>

      <v-main>
        <router-view/>
      </v-main>

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
    loading: true,
    triggerDrawer: 0
  }),
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }
    this.loading = false
  },
  methods: {
    openDrawer() {
      this.triggerDrawer++
    }
  },
  computed: {
    ...mapGetters(['info']),
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(fbError) {
      this.$message(messages[fbError.code] || fbError.code)
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

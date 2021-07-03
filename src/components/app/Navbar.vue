<template>
  <v-app-bar
  >
    <v-app-bar-nav-icon
      @click="$emit('drawer')"
    >
    </v-app-bar-nav-icon>
    <v-toolbar-title>
      {{ 'AppName' | localize }}
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-menu
      left
      bottom
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list
        v-model="selectedItem"
      >
        <v-list-item
          link
          :to="{name: 'profile'}"
          :exact="true"
          nav
        >
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{ 'Profile' | localize }}
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          @click="switchDarkMode"
        >
          <v-list-item-icon>
            <v-icon>mdi-theme-light-dark</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{ 'DarkMode' | localize }}
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          @click="logout"
        >
          <v-list-item-icon>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{ 'Logout' | localize }}
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-menu>

  </v-app-bar>
</template>

<script>
export default {
  name: "Navbar",
  data: () => ({
    datetime: new Date(),
    interval: null,
    dropdown: null,
    selectedItem: 0,
    darkMode: false
  }),
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      await this.$router.push({name: 'login', query: {message: 'logout', 'path': this.$route.path}})
    },
    switchDarkMode() {
      this.darkMode = !this.darkMode
      this.$vuetify.theme.dark = this.darkMode
      localStorage.setItem('darkMode', this.darkMode.toString())
    },
  },
  computed: {
    name() {
      return this.$store.getters.info.name
    }
  },
  mounted() {
    this.darkMode = localStorage.getItem('darkMode') === 'true' || false
    this.$vuetify.theme.dark = this.darkMode
  }
}
</script>

<style scoped>

</style>

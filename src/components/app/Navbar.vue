<template>
  <nav class="navbar blue darken-4">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a href="#" @click.prevent="$emit('click')">
          <i class="material-icons">menu</i>
        </a>
        <div class="navbar-header" @click.prevent="$emit('click')">{{ 'AppName' | localize }}</div>

      </div>

      <div
        class="right"
        ref="dropDownContainer"
      >
        <a
          ref="dropdownProfile"
          class="dropdown-trigger"
          href="#"
          data-target="dropdown"
        >
          {{ name }}
          <i class="material-icons right">arrow_drop_down</i>
        </a>

        <ul id='dropdown' class='dropdown-content'>
          <li>
            <router-link to="/profile" class="black-text">
              <i class="material-icons">account_circle</i>
              {{ 'Profile' | localize }}
            </router-link>
          </li>
          <li class="divider" tabindex="-1"></li>
          <li>
            <a href="#" class="black-text" @click.prevent="logout">
              <i class="material-icons">assignment_return</i>
              {{ 'Logout' | localize }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data: () => ({
    datetime: new Date(),
    interval: null,
    dropdown: null
  }),
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      await this.$router.push('/login?message=logout')
    }
  },
  computed: {
    name() {
      return this.$store.getters.info.name
    }
  },
  mounted() {
    if (this.dropdown === null && this.$refs.dropdownProfile) {
      this.dropdown = M.Dropdown.init(this.$refs.dropdownProfile, {
        constrainWidth: false,
        alignment: 'right',
        container: this.$refs.dropDownContainer
      })
    }
  },
  beforeDestroy() {
    if (this.dropdown && this.dropdown.destroy) {
      this.dropdown.destroy()
      this.dropdown = null
    }
  }
}
</script>

<style scoped>
.navbar-header {
  font-size: 2rem;
  cursor: pointer;
}
</style>

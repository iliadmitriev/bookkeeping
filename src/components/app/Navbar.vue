<template>
  <nav class="navbar blue darken-4">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a href="#" @click.prevent="$emit('click')">
          <i class="material-icons">menu</i>
        </a>
        <div class="navbar-header" @click.prevent="$emit('click')">Финансы</div>

      </div>

      <ul
        class="right">
        <li>
          <a
            ref="dropdownProfile"
            class="dropdown-trigger"
            href="#"
            data-target="dropdown"
          >
            USER NAME
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id='dropdown' class='dropdown-content'>
            <li>
              <router-link to="/profile" class="black-text">
                <i class="material-icons">account_circle</i>Профиль
              </router-link>
            </li>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a href="#" class="black-text" @click.prevent="logout">
                <i class="material-icons">assignment_return</i>Выйти
              </a>
            </li>
          </ul>
        </li>
      </ul>
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
  mounted() {

    this.dropdown = M.Dropdown.init(this.$refs.dropdownProfile, {
      constrainWidth: true
    })
  },
  beforeDestroy() {
    if (this.dropdown && this.dropdown.destroy) {
      this.dropdown.destroy()
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

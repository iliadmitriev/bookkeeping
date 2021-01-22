<template>
  <div class="fixed-action-btn">
    <router-link
      v-tooltip="$options.filters.localize('AddNewRecord')"
      class="btn-floating btn-large blue"
      to="/record"
    >
      <i class="large material-icons">add</i>
    </router-link>
  </div>
</template>

<script>
export default {
name: "FloatButton"
}
</script>

<style scoped>

</style>

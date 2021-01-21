<template>
  <div class="fixed-action-btn">
    <router-link
      class="btn-floating btn-large blue"
      to="/record"
      v-tooltip="'Добавить новую запись'"
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

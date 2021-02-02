<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">

      <v-btn
        color="primary"
        class="float-right"
        v-bind="attrs"
        v-on="on"
        elevation="2"
        fab
        bottom
        fixed
        right
        link
        :to="'/record'"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <span>
      {{ 'AddNewRecord' | localize }}
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: "FloatButton"
}
</script>

<style scoped>

</style>

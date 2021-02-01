<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">

      <v-btn
        color="primary"
        class="btn-add"
        v-bind="attrs"
        v-on="on"
        elevation="2"
        absolute
        fab
        bottom
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
.btn-add {
  bottom: 0;
  position: absolute;
  margin: 0 0 50px 0;
}
</style>

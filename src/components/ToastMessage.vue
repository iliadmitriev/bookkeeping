<template>
  <v-snackbar
    v-model="show"
    :timeout="timeout"
    @click="close"
  >
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="red"
        text
        v-bind="attrs"
        @click="dismiss"
      >
        &times;
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>

export default {
  name: "ToastMessage",
  props: {
    message: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      required: false,
      default: 2000
    },
  },
  data: () => ({
    show: false
  }),
  mounted() {
    this.show = true
  },
  methods: {
    dismiss() {
      this.show = false
    },
    close() {
      this.show = false
    }
  }
}
</script>

<style scoped>

</style>

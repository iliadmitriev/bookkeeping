<template>
  <v-snackbar
    v-model="show"
    :timeout="timeout"
    @click="close"
    elevation="2"
  >
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="red"
        text
        v-bind="attrs"
        @click="close"
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
    show: true
  }),
  watch: {
    show(value) {
      this.dismiss()
    }
  },
  methods: {
    dismiss() {
      this.show = false
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
    close() {
      this.dismiss()
    }
  }
}
</script>

<style scoped>

</style>

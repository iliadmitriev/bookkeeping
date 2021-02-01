<template>
  <v-col
    cols="12"
    sm="6"
  >
    <v-card
      :color="$vuetify.theme.dark ? 'light-blue darken-3' :'light-blue accent-1'"
    >
      <v-card-title>
        <span class="card-title">{{ 'HomeAccount' | localize }}</span>
      </v-card-title>
      <v-card-text>
        <p
          v-for="cur in currencies"
          :key="cur"
        >
          <span>{{ getCurrency(cur) | currency(cur) }}</span>
          <v-divider />
        </p>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {
name: "HomeAccount",
  props: {
    rates: Object
  },
  data: ()=>({
    currencies: ['RUB', 'USD', 'EUR']
  }),
  computed: {
    base() {
      return this.$store.getters.info.bill
    }
  },
  methods: {
    getCurrency(currency) {
      const val = currency==='RUB' ? 1 : this.rates[currency].Value
      return Math.floor(this.base / val)
    }
  }
}
</script>

<style scoped>

</style>

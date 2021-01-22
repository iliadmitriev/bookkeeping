<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">{{ 'HomeAccount' | localize }}</span>

        <p
          class="currency-line"
          v-for="cur in currencies"
          :key="cur"
        >
          <span>{{ getCurrency(cur) | currency(cur) }}</span>
        </p>
      </div>
    </div>
  </div>
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

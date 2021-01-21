<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">Курс валют</span>
        </div>
        <table>
          <thead>
          <tr>
            <th>Валюта</th>
            <th>Курс</th>
            <th>Дата</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="cur in currencies">
            <td>{{ cur }}</td>
            <td>{{ getCurrency(cur) }}</td>
            <td>{{ getDate() }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeCurrency",
  props: {
    rates: Object,
    date: String
  },
  data: ()=>({
    currencies: ['USD', 'EUR']
  }),
  computed: {
    base() {
      return ( this.rates['RUB'] )
    }
  },
  methods: {
    getCurrency(currency) {
      return (this.base / this.rates[currency]).toFixed(4)
    },
    getDate() {
      return new Date(this.date).toLocaleDateString()
    }
  }

}
</script>

<style scoped>

</style>

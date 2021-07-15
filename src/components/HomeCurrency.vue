<template>
  <v-col
    cols="12"
    sm="6"
  >
    <v-card :color="colorClass">
      <v-card-title>
        <span>{{ 'CurrencyRates' | localize }}</span>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :items="data"
          :headers="dataHeaders"
          :item-key="'currency'"
          :disable-filtering="true"
          :disable-pagination="true"
          :disable-sort="true"
          :hide-default-footer="true"
          :mobile-breakpoint="0"
        >

          <template
            v-slot:header="{ mobile, props: { headers } }"
          >
            <v-data-table-header
              :class="colorClass">
              <tr>
                <th v-for="h in headers">
                  {{ h.text }}
                </th>
              </tr>
            </v-data-table-header>
          </template>


          <template
            v-slot:body="{ items }"
          >
            <tbody :class="colorClass">
            <tr
              v-for="item in items"
              :key="item.currency"
            >
              <td>{{ item.currency }}</td>
              <td>{{ item.rate }}</td>
              <td>{{ item.date }}</td>
            </tr>
            </tbody>
          </template>

        </v-data-table>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import numberFilter from "@/filters/number.filter";
import dateFilter from "@/filters/date.filter";

export default {
  name: "HomeCurrency",
  props: {
    rates: Object,
    date: String
  },
  data: () => ({
    currencies: ['USD', 'EUR']
  }),
  computed: {
    colorClass() {
      return this.$vuetify.theme.dark ? 'orange darken-3' : 'orange accent-1'
    },
    data() {
      return this.currencies.map((c, i) => {
        return {
          currency: c,
          rate: numberFilter(this.getCurrency(c)),
          date: dateFilter(this.getDate(), false)
        }
      })
    },
    dataHeaders() {
      return [
        {text: 'Валюта', value: 'currency', class: this.colorClass},
        {text: 'Курс', value: 'rate', class: this.colorClass},
        {text: 'Дата', value: 'date', class: this.colorClass}
      ]
    }
  },
  methods: {
    getCurrency(currency) {
      return currency === 'RUB' ? 1 : this.rates[currency].Value
    },
    getDate() {
      return new Date(this.date)
    }
  }

}
</script>

<style scoped>

</style>

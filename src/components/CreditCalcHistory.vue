<template>
  <v-card elevation="0">
    <v-card-title>График платежей</v-card-title>

    <v-card-text>

      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-menu
          v-model="dateStartMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateStartPayment"
              label="Дата начала платежей"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateStartPayment"
            @input="dateStartMenu = false"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <v-data-table
        :items="calculateLoanAnnuity"
        :item-key="calculateLoanAnnuity.num"
        :headers="historyHeaders"
        :items-per-page="12"
      >
        <template slot="body.prepend">
          <tr>
            <th></th>
            <th class="th-text-right">{{ creditAmount + totalInterestAnnuity | number }}</th>
            <th class="th-text-right">{{ totalInterestAnnuity | number }}</th>
            <th class="th-text-right">{{ creditAmount | number }}</th>
            <th></th>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import numberFilter from "@/filters/number.filter";

export default {
name: "CreditCalcHistory",
  props: {
    annuity: {
      type: Boolean,
      required: true
    },
    paymentAnnuity: {
      type: Number,
      required: true
    },
    totalInterestAnnuity: {
      type: Number,
      required: true
    },
    creditAmount: {
      type: Number,
      required: true
    },
    numberOfPayments: {
      type: Number,
      required: true
    },
    periodRate: {
      type: Number,
      required: true
    }
  },
  data: ()=>({
    dateStartPayment: new Date().toISOString().substr(0, 10),
    dateStartMenu: false,
    historyHeaders: [
      {value: 'num', text: '#', align: 'right'},
      {value: 'payment', text: 'Платеж', align: 'right', filter: numberFilter},
      {value: 'interest', text: 'Процеты', align: 'right'},
      {value: 'body', text: 'Основной долг', align: 'right'},
      {value: 'amountLeft', text: 'Остаток долга', align: 'right'}
    ]
  }),
  computed: {

    calculateLoanAnnuity() {

      let amountLeft = this.creditAmount

      const history = []
      for (let i = 0; i < this.numberOfPayments; i++) {
        const interest = amountLeft * this.periodRate
        const body = this.paymentAnnuity - interest
        const num = i + 1
        amountLeft += (interest - this.paymentAnnuity)

        history.push({
          num,
          amountLeft: numberFilter(amountLeft),
          payment: numberFilter(this.paymentAnnuity),
          interest: numberFilter(interest),
          body: numberFilter(body)
        })
      }

      return history

    },

  },

}
</script>

<style scoped>
.th-text-right {
  text-align: right !important;
}

</style>

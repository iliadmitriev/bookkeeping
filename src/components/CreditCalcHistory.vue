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
        :items="calculateLoanHistory"
        :item-key="calculateLoanHistory.num"
        :headers="historyHeaders"
        :items-per-page="12"
        :group-by="'year'"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [12,24,36,-1],
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          prevIcon: 'mdi-chevron-left',
          nextIcon: 'mdi-chevron-right'
        }"
      >
        <template slot="body.prepend">
          <tr>
            <th></th>
            <th></th>
            <th class="th-text-right">{{ creditAmount + totalInterest | number }}</th>
            <th class="th-text-right">{{ totalInterest | number }}</th>
            <th class="th-text-right">{{ creditAmount | number }}</th>
            <th></th>
          </tr>
        </template>
        <template v-slot:group.header="{items, isOpen, toggle}">
          <th>
            <v-icon @click="toggle"
            >{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
            </v-icon>
          </th>
          <th class="th-text-center">{{ items[0].year }}</th>
          <th class="th-text-right">{{ sum(items, 'payment') | number }}</th>
          <th class="th-text-right">{{ sum(items, 'interest') | number }}</th>
          <th class="th-text-right">{{ sum(items, 'body') | number }}</th>
          <th class="th-text-right">{{ items[items.length - 1].amountLeft | number }}</th>
        </template>

        <template v-slot:item.payment="{item}">
          {{ item.payment | number }}
        </template>

        <template v-slot:item.interest="{item}">
          {{ item.interest | number }}
        </template>

        <template v-slot:item.body="{item}">
          {{ item.body | number }}
        </template>

        <template v-slot:item.amountLeft="{item}">
          {{ item.amountLeft | number }}
        </template>

      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import numberFilter from "@/filters/number.filter"
import dateFilter from '@/filters/date.filter'

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
    totalInterest: {
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
  data: () => ({
    dateStartPayment: new Date().toISOString().substr(0, 10),
    dateStartMenu: false,
    historyHeaders: [
      {value: 'num', text: '#', align: 'right'},
      {value: 'year', text: 'Год', groupable: true},
      {value: 'date', text: 'Дата платежа', align: 'center'},
      {value: 'payment', text: 'Платежи', align: 'right'},
      {value: 'interest', text: 'Проценты', align: 'right'},
      {value: 'body', text: 'Основной долг', align: 'right'},
      {value: 'amountLeft', text: 'Остаток долга', align: 'right'}
    ]
  }),
  methods: {
    sum(arr, field) {
      return arr.reduce((s, i) => s += i[field], 0)
    }
  },
  computed: {

    calculateLoanHistory() {
      return this.annuity
        ? this.calculateLoanAnnuity
        : this.calculateLoanDifferential
    },

    calculateLoanAnnuity() {

      let amountLeft = this.creditAmount
      let currMonth = new Date(this.dateStartPayment)

      const history = []
      for (let i = 0; i < this.numberOfPayments; i++) {
        const interest = amountLeft * this.periodRate
        const body = this.paymentAnnuity - interest
        const num = i + 1
        amountLeft += (interest - this.paymentAnnuity)

        history.push({
          num,
          date: dateFilter(currMonth, false),
          year: `${(currMonth).getFullYear()}`,
          payment: this.paymentAnnuity,
          interest: interest,
          body: body,
          amountLeft: amountLeft
        })

        currMonth = new Date(currMonth.setMonth(currMonth.getMonth() + 1))
      }

      return history

    },

    calculateLoanDifferential() {
      const history = []

      const S = this.creditAmount
      const r = this.periodRate
      const n = this.numberOfPayments

      let currMonth = new Date(this.dateStartPayment)
      let amountLeft = S
      let payment = 0
      let paymentTotal = 0

      for (let i = 0; i < n; i++) {
        payment = S / n + amountLeft * r
        paymentTotal += payment
        amountLeft += amountLeft * r - payment

        history.push({
          num: i+1,
          date: dateFilter(currMonth, false),
          year: `${(currMonth).getFullYear()}`,
          payment,
          interest: payment - S / n,
          body: S / n,
          amountLeft: amountLeft
        })

        currMonth = new Date(currMonth.setMonth(currMonth.getMonth() + 1))

      }

      return history
    }

  },

}
</script>

<style scoped>
.th-text-right {
  text-align: right !important;
}

.th-text-center {
  text-align: center !important;
}

</style>

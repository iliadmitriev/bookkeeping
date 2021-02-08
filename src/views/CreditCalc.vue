<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        md="4"
      >
        <v-card
          elevation="0"
        >
          <v-card-text>
            <v-select
              label="Тип кредита"
              :items="creditTypes"
              v-model="creditType"
              :prepend-inner-icon="creditTypeIcon"
              item-text="text"
              item-value="value"
            >
            </v-select>
            <v-text-field
              v-if="creditType!=='consumerLoan'"
              prepend-inner-icon="mdi-cash"
              label="Стоимость объекта"
              v-model="objectCostText"
              :rules="objectCostRules"
            ></v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-finance"
              label="Сумма кредита"
              v-model="creditAmountText"
              :rules="creditAmountRules"
            ></v-text-field>

            <v-text-field
              type="number"
              prepend-inner-icon="mdi-percent"
              label="Процентная ставка"
              v-model="interestRate"
            >
              <template v-slot:append>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ interestRateUnitText }}
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in interestRateUnits"
                      :key="index"
                      @click="interestRateUnit = item.value "
                    >
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-text-field>
            <v-text-field
              type="number"
              prepend-inner-icon="mdi-clock"
              label="Срок кредита"
              v-model="loanTerm"
            >

              <template v-slot:append>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ creditTermUnitText }}
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in creditTermUnits"
                      :key="index"
                      @click="creditTermUnit = item.value"
                    >
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-text-field>

            <v-switch
              v-model="annuity"
            >
              <template v-slot:label>
                {{ annuity ? 'Аннуитетный' : 'Дифференцированный' }}
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                    >mdi-help-circle
                    </v-icon>
                  </template>
                  <span v-if="annuity">Выплаты по аннуитету осуществляются равными суммами через равные промежутки времени. Сумма аннуитетного платежа включает в себя и основной долг, и вознаграждение.</span>
                  <span v-else>Сумма в погашение тела кредита в дифференцированном платеже всегда постоянна. Процентная часть в сумме дифференцированного платежа сначала большая, а потом снижается, так как зависит от основного долга по кредиту</span>
                </v-tooltip>
              </template>
            </v-switch>

            <v-menu
              v-model="startDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="startDate"
                  label="Дата начала платежей"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                @input="startDateMenu = false"
              ></v-date-picker>
            </v-menu>

          </v-card-text>

          <v-divider></v-divider>
          <v-card-text
            v-if="annuity"
          >
            <v-row>
              <v-col>Платеж в мес</v-col>
              <v-col><span class="payments">{{ paymentAnnuity | number }}</span></v-col>
            </v-row>
            <v-row>
              <v-col>Сумма выплат</v-col>
              <v-col><span class="payments">{{ totalPaymentAnnuity | number }}</span></v-col>
            </v-row>
            <v-row>
              <v-col>Переплата по кредиту</v-col>
              <v-col><span class="payments">{{ totalInterestAnnuity | number }}</span></v-col>
            </v-row>
          </v-card-text>
          <v-card-text
            v-else
          >
            <v-row>
              <v-col>Первый платеж</v-col>
              <v-col><span class="payments">{{ paymentDifferentiatedFirst | number }}</span></v-col>
            </v-row>
            <v-row>
              <v-col>Последний платеж</v-col>
              <v-col><span class="payments">{{ paymentDifferentiatedLast | number }}</span></v-col>
            </v-row>
            <v-row>
              <v-col>Сумма выплат</v-col>
              <v-col><span class="payments">{{ totalPaymentDifferentiated | number }}</span></v-col>
            </v-row>
            <v-row>
              <v-col>Переплата по кредиту</v-col>
              <v-col><span class="payments">{{ totalInterestDifferentiated | number }}</span></v-col>
            </v-row>
          </v-card-text>


          <CreditCalcChart
            :creditAmount="creditAmount"
            :totalInterest="totalInterest"
            :key="creditAmount + totalInterest"
          ></CreditCalcChart>

        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <v-row>
          <v-col
            cols="12"
          >
            <CreditCalcAdvancePayment
              :annuity="annuity"
              :credit-amount="creditAmount"
              :total-interest="totalInterest"
              :payment-annuity="paymentAnnuity"
              :number-of-payments="numberOfPayments"
              :period-rate="periodRate"
              :date-start-payment="new Date(startDate)"
              @advancePayments="advancePayments"

            ></CreditCalcAdvancePayment>
          </v-col>
          <v-col
            cols="12"
          >
            <CreditCalcHistory
              :history="calculateLoanHistory"
            ></CreditCalcHistory>
          </v-col>
        </v-row>

      </v-col>
    </v-row>
    <v-row>

      <v-col
        cols="12"
      >
        <v-card elevation="0">
          <v-card-title>
            Диаграммы погашения
          </v-card-title>

          <v-card-text/>
          <CreditCalcHistoryChart
            :history="calculateLoanHistory"
          />
          <v-card-text/>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import localizeFilter from "@/filters/localize.filter";
import CreditCalcChart from '@/components/CreditCalcChart'
import CreditCalcHistory from "@/components/CreditCalcHistory";
import CreditCalcHistoryChart from "@/components/CreditCalcHistoryChart";
import CreditCalcAdvancePayment from "@/components/CreditCalcAdvancePayment";
import {addMonths, numberOfPaymentsLeft} from "@/utils/helpers";
import dateFilter from "@/filters/date.filter";


export default {
  name: "CreditCalc",
  components: {CreditCalcAdvancePayment, CreditCalcHistory, CreditCalcChart, CreditCalcHistoryChart},
  data: () => ({
    creditTypes: [
      {text: 'Ипотека', value: 'mortgage', icon: 'mdi-home'},
      {text: 'Автокредит', value: 'carLoan', icon: 'mdi-car'},
      {text: 'Потребительский', value: 'consumerLoan', icon: 'mdi-cash'}
    ],
    creditType: 'mortgage',
    objectCost: 5000000,
    objectCostText: '5 000 000',
    objectCostRules: [
      v => !!v || localizeFilter('Required')
    ],
    creditAmount: 4000000,
    creditAmountText: '4 000 000',
    creditAmountRules: [
      v => !!v || localizeFilter('Required')
    ],
    interestRate: 8.5,
    interestRateUnit: 'y',
    interestRateUnits: [
      {text: 'в мес', value: 'm'},
      {text: 'в год', value: 'y'},
    ],
    annuity: true,
    loanTerm: 20,
    creditTermUnit: 'y',
    creditTermUnits: [
      {text: 'мес', value: 'm'},
      {text: 'лет', value: 'y'},
    ],
    startDate: (new Date()).toISOString().substr(0, 10),
    startDateMenu: false,
    additionalPayments: [],
    redrawChartsKey: 0
  }),
  mounted() {

  },
  watch: {
    objectCostText(value) {
      this.objectCost = Number.parseInt(value.replace(/\D/g, '')) || 0
      this.objectCostText = (new Intl.NumberFormat('ru-RU')
        .format(this.objectCost))
    },
    creditAmountText(value) {
      this.creditAmount = Number.parseInt(value.replace(/\D/g, '')) || 0
      this.creditAmountText = (new Intl.NumberFormat('ru-RU')
        .format(this.creditAmount))
    }
  },
  methods: {
    advancePayments(advPayments) {
      this.additionalPayments = advPayments
      this.redrawChartsKey++
    },
    dataset(history) {
      this.redrawChartsKey++
    },
    paymentDifferentiated(num, f) {
      const S = this.creditAmount
      const r = this.periodRate
      const n = this.numberOfPayments

      let amountLeft = S
      let payment = 0
      let paymentTotal = 0

      for (let i = 0; i < num; i++) {
        payment = S / n + amountLeft * r
        paymentTotal += payment
        amountLeft += amountLeft * r - payment
      }

      if (!!f && typeof f === 'function') {
        return f({payment, amountLeft, paymentTotal})
      }
      return payment
    },
  },
  computed: {
    displayBlock() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          return false
        case 'md':
        case 'lg':
        case 'xl':
        default:
          return true
      }
    },
    creditTermUnitText() {
      return this.creditTermUnits.find(i => this.creditTermUnit === i.value).text
    },
    interestRateUnitText() {
      return this.interestRateUnits.find(i => this.interestRateUnit === i.value).text
    },
    creditTypeIcon() {
      return this.creditTypes.find(i => i.value === this.creditType).icon
    },
    totalPaymentAnnuity() {
      return this.paymentAnnuity * this.numberOfPayments
    },
    totalInterestAnnuity() {
      return this.totalPaymentAnnuity - this.creditAmount
    },
    paymentAnnuity() {
      const S = this.creditAmount
      const r = this.periodRate
      const n = this.numberOfPayments

      return S * (r * (1 + r) ** n) / ((1 + r) ** n - 1) || S / n
    },
    paymentDifferentiatedFirst() {
      return this.paymentDifferentiated(1)
    },
    paymentDifferentiatedLast() {
      return this.paymentDifferentiated(this.numberOfPayments)
    },
    totalPaymentDifferentiated() {
      return this.paymentDifferentiated(this.numberOfPayments, ({paymentTotal}) => paymentTotal)
    },
    totalInterestDifferentiated() {
      return this.totalPaymentDifferentiated - this.creditAmount
    },
    totalInterest() {
      return this.annuity
        ? this.totalInterestAnnuity
        : this.totalInterestDifferentiated
    },
    periodRate() {
      return this.interestRateUnit === 'y'
        //? ((100 + this.interestRate) / 100 ) ** (1/12) - 1
        ? this.interestRate / 100 / 12
        : this.interestRate / 100
    },
    numberOfPayments() {
      return this.creditTermUnit === 'y'
        ? +this.loanTerm * 12
        : +this.loanTerm
    },
    calculateLoanHistory() {
      const dataset = this.annuity
        ? this.calculateLoanAnnuity
        : this.calculateLoanDifferential
      this.$emit('dataset', dataset)
      return dataset
    },
    calculateLoanAnnuity() {

      const currMonth = new Date(this.startDate)
      const r = this.periodRate
      const history = []
      let amountLeft = this.creditAmount
      let paymentTotal = 0
      let i = 0
      let paymentAnnuity = this.paymentAnnuity
      let payment = 0
      let body = 0
      let n = this.numberOfPayments
      let month = null

      while (amountLeft > 1) {
        const interest = amountLeft * r
        // amountLeft += interest

        if (payment - interest < amountLeft) {
          payment = paymentAnnuity
        } else {
          payment = amountLeft + interest
        }
        body = payment - interest
        month = addMonths(currMonth, i)
        amountLeft -= body
        paymentTotal += payment

        history.push({
          num: i,
          date: dateFilter(month, false),
          datetime: month,
          year: `${(month).getFullYear()}`,
          payment: payment,
          interest: interest,
          body: body,
          amountLeft: amountLeft,
          amountPayed: paymentTotal
        })

        const advPayment = this.additionalPayments.find(item => {
          return (addMonths(currMonth, i) <= item.datetime && item.datetime < addMonths(currMonth, i + 1))
        })

        if (advPayment && advPayment.type && +advPayment.amount > 0) {
          payment = +advPayment.amount
          n = numberOfPaymentsLeft(paymentAnnuity, r, amountLeft)
          body = payment
          month = advPayment.datetime
          amountLeft -= body
          paymentTotal += payment
          if (advPayment.type === 'payment') {
            paymentAnnuity = amountLeft * (r * (1 + r) ** n) / ((1 + r) ** n - 1)
          }
          history.push({
            num: i,
            date: dateFilter(month, false),
            datetime: month,
            year: `${(month).getFullYear()}`,
            payment: payment,
            interest: 0,
            body: body,
            amountLeft: amountLeft,
            amountPayed: paymentTotal
          })
        }

        ++i
        n--

      }
      return history
    },
    calculateLoanDifferential() {
      const history = []

      const S = this.creditAmount
      const r = this.periodRate
      const n = this.numberOfPayments

      const currMonth = new Date(this.startDate)
      let amountLeft = S
      let payment = 0
      let paymentTotal = 0

      for (let i = 0; i < n; i++) {
        payment = S / n + amountLeft * r
        paymentTotal += payment
        amountLeft += amountLeft * r - payment
        const month = addMonths(currMonth, i)

        history.push({
          num: i + 1,
          date: dateFilter(month, false),
          datetime: month,
          year: `${(month).getFullYear()}`,
          payment,
          interest: payment - S / n,
          body: S / n,
          amountLeft: amountLeft,
          amountPayed: paymentTotal
        })

      }

      return history
    }

  }
}
</script>

<style scoped>
.payments {
  font-size: 1rem;
  display: block;
  text-align: right;
}
</style>

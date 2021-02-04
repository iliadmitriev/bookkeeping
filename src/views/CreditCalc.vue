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

          </v-card-text>

          <v-card-text>Платеж в мес {{ calculateLoanAnnuity.payment | number }}</v-card-text>
          <v-card-text>Сумма выплат {{ calculateLoanAnnuity.totalPayment | number }}</v-card-text>
          <v-card-text>Переплата по кредиту {{ calculateLoanAnnuity.totalInterest | number }}</v-card-text>

          <div ref="reff"></div>
          <canvas ref="canvas">
          </canvas>

        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="8"
        class="d-none d-md-block"
      >
        <v-card elevation="0">
          <v-card-title>График платежей</v-card-title>
          <v-card-text>
            <v-data-table
              :items="calculateLoanAnnuity.history"
              :item-key="calculateLoanAnnuity.history.num"
              :headers="historyHeaders"
              :items-per-page="12"
            >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="12"
        class="d-none d-md-block"
      >
        <v-card elevation="0">
          График
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import localizeFilter from "@/filters/localize.filter";
import numberFilter from "@/filters/number.filter";
import localize from "@/filters/localize.filter";
import {random_rgba} from "@/utils/helpers";
import Chart from 'chart.js';


export default {
  name: "CreditCalc",
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
    interestRate: 10,
    interestRateUnit: 'y',
    interestRateUnits: [
      {text: 'в мес', value: 'm'},
      {text: 'в год', value: 'y'},
    ],
    annuity: true,
    loanTerm: 10,
    creditTermUnit: 'y',
    creditTermUnits: [
      {text: 'мес', value: 'm'},
      {text: 'лет', value: 'y'},
    ],
    interestChart: null,
    historyHeaders: [
      {value: 'num', text: '#', align: 'right'},
      {value: 'payment', text: 'Платеж', align: 'right', filter: numberFilter},
      {value: 'interest', text: 'Процеты', align: 'right'},
      {value: 'body', text: 'Основной долг', align: 'right'},
      {value: 'amountLeft', text: 'Остаток долга', align: 'right'}
    ]
  }),
  watch: {
    objectCostText(value) {
      const IntVal = Number.parseInt(value.replace(/\D/g, '')) || 0
      this.objectCost = IntVal
      const StrVal = (new Intl.NumberFormat('ru-RU')
        .format(this.objectCost))
      this.objectCostText = StrVal
    },
    creditAmountText(value) {
      const IntVal = Number.parseInt(value.replace(/\D/g, '')) || 0
      this.creditAmount = IntVal
      const StrVal = (new Intl.NumberFormat('ru-RU')
        .format(this.creditAmount))
      this.creditAmountText = StrVal
    }
  },
  methods: {
    renderChart($el, {type, data, options}) {
      if (this.interestChart) {
        this.interestChart.destroy()
      }
      this.interestChart = new Chart($el, {
        type: type,
        data: data,
        options: options
      });
    }
  },
  computed: {
    creditTermUnitText() {
      return this.creditTermUnits.find(i => this.creditTermUnit === i.value).text
    },
    interestRateUnitText() {
      return this.interestRateUnits.find(i => this.interestRateUnit === i.value).text
    },
    creditTypeIcon() {
      return this.creditTypes.find(i => i.value === this.creditType).icon
    },
    calculateLoanAnnuity() {
      const S = this.creditAmount
      const r = this.interestRateUnit === 'y'
        //        ? ((100 + this.interestRate) / 100 ) ** (1/12) - 1
        ? this.interestRate / 100 / 12
        : this.interestRate / 100
      const n = this.creditTermUnit === 'y'
        ? this.loanTerm * 12
        : this.loanTerm

      let amountLeft = S
      const payment = S * (r * (1 + r) ** n) / ((1 + r) ** n - 1)
      const totalPayment = payment * n
      const totalInterest = totalPayment - S

      const history = []
      for (let i = 0; i < n; i++) {
        const interest = amountLeft * r
        const body = payment - interest
        const num = i + 1
        amountLeft += interest
        amountLeft -= payment
        history.push({
          num,
          amountLeft: numberFilter(amountLeft),
          payment: numberFilter(payment),
          interest: numberFilter(interest),
          body: numberFilter(body)
        })
      }

      const {backgroundColors, borderColors} = random_rgba(2, 0.2)


      if (this.$refs.canvas) {
        this.renderChart(this.$refs.canvas.getContext('2d'),
          {
            type: 'pie',
            data: {
              labels: ['Основной долг', 'Переплата'],
              legend: {
                hidden: true
              },
              datasets: [{
                label: '',
                data: [this.creditAmount, Math.round(totalInterest)],
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
              }]
            },
            options: {
              legend: {
                display: false
              }
            }
          }
        )

      }


      return {
        payment,
        totalPayment,
        totalInterest,
        history
      }
    }
  }
}
</script>

<style scoped>

</style>

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
              type="number"
              prepend-inner-icon="mdi-cash"
              label="Стоимость объекта"
              v-model="objectConst"
            ></v-text-field>
            <v-text-field
              type="number"
              prepend-inner-icon="mdi-finance"
              label="Сумма кредита"
              v-model="creditAmount"
            ></v-text-field>


            <v-input>
              <template slot="default">
              <v-col>
                <v-text-field
                  type="number"
                  prepend-inner-icon="mdi-percent"
                  label="Процентная ставка"
                  v-model="interestRate"
                ></v-text-field>
              </v-col>
              </template>
              <template slot="messages">
                this is text
              <v-col>
                <v-slider
                  min="0"
                  step="0.1"
                  max="20"
                  v-model="interestRate"
                ></v-slider>
              </v-col>
              </template>
            </v-input>

            <v-row>
              <v-col>
                <v-text-field
                  type="number"
                  prepend-inner-icon=""
                  label="Срок кредита"
                  v-model="loanTerm"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-select
                  v-model="creditTermUnit"
                  :items="creditTermUnits"
                  item-text="text"
                  item-value="value"
                  label=""
                ></v-select>
              </v-col>
              <v-col>
                <v-slider
                  dense
                  min="1"
                  step="1"
                  :max="maxLoanTerm"
                  v-model="loanTerm"
                ></v-slider>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text>
            Платеж в мес {{ calculateLoan.payment | number }}
          </v-card-text>


        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="8"
        class="d-none d-md-block"
      >
        <v-card
        >
          Платежи
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="12"
        class="d-none d-md-block"
      >
        <v-card>
          График
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "CreditCalc",
  data: () => ({
    creditTypes: [
      {text: 'Ипотека', value: 'mortgage', icon: 'mdi-home'},
      {text: 'Автокредит', value: 'carLoan', icon: 'mdi-car'},
      {text: 'Потребительский', value: 'consumerLoan', icon: 'mdi-cash'}
    ],
    creditType: 'mortgage',
    objectConst: 5000000,
    creditAmount: 4000000,
    interestRate: 5.5,
    loanTerm: 10,
    creditTermUnit: 'y',
    creditTermUnits: [
      {text: 'мес', value: 'm'},
      {text: 'лет', value: 'y'},
    ]
  }),
  computed: {
    creditTypeIcon() {
      return this.creditTypes.find(i => i.value === this.creditType).icon
    },
    maxLoanTerm() {
      switch (this.creditTermUnit) {
        case 'd':
          return 30
        case 'm':
          return 24
        case 'y':
          return 30
      }
    },
    calculateLoan() {
      const S = this.creditAmount
      const r = this.interestRate / 12 / 100
      const n = this.creditTermUnit === 'y'
        ? this.loanTerm * 12
        : this.loanTerm

      console.log(S, r, n)
      return {
        payment: S * (r * (1 + r) ** n) / ((1 + r) ** n - 1)
      }
    }
  }
}
</script>

<style scoped>

</style>

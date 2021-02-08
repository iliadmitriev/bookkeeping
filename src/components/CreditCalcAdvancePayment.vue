<template>
  <v-card elevation="0">
    <v-card-title>
      Досрочное погашение
    </v-card-title>

    <v-card-text>
      <v-checkbox
        v-model="calcInflation"
        :label="`Учитывать инфляцию`"
      ></v-checkbox>
      <v-text-field
        v-if="calcInflation"
        type="number"
        prepend-inner-icon="mdi-percent"
        label="Среднее значение инфляции в год"
        v-model="inflationRate"
      ></v-text-field>

    </v-card-text>

    <v-card-text>
      <v-data-table
        :headers="advancePaymentsHeaders"
        :items="advancePayments"
        :no-data-text="'Нет досрочных платежей'"
        :items-per-page="-1"
        :hide-default-footer="true"
        class="elevation-0"
      >

        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-spacer/>
            <v-dialog
              v-model="dialog"
              max-width="500px"
              @click:outside="close"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ 'Add' | localize }}
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-form
                  v-model="valid"
                  ref="editForm"
                  @submit.prevent="save"
                >
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                          md="6"
                        >
                          <v-text-field
                            :label="'Сумма'"
                            type="number"
                            :rules="amountRules"
                            v-model.number="editedItem.amount"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-menu
                            v-model="dateOfPaymentMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                :label="'Дата платежа'"
                                prepend-icon="mdi-calendar"
                                v-model="dateOfPayment"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="datetimeRules"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="dateOfPayment"
                              @input="dateOfPaymentMenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-radio-group
                          v-model="editedItem.type"
                          :rules="typeRules"
                        >
                          <v-radio
                            :label="'Уменьшение ежемесячного платежа'"
                            :value="'payment'"
                          ></v-radio>
                          <v-radio
                            :label="'Уменьшение срока кредита'"
                            :value="'term'"
                          ></v-radio>
                        </v-radio-group>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-text
                    v-if="valid"
                  >
                    <v-alert
                      v-if="editedItem.type === 'payment'"
                      type="info"
                    >
                      Ежемесячный платеж сократится с - на -
                    </v-alert>
                    <v-alert
                      v-else-if="editedItem.type === 'term'"
                      type="info"
                    >
                      Срок кредита сократится c {{ numberOfPayments }}
                      до {{ numberOfPaymentsLeft(paymentAnnuity, periodRate, creditAmount - editedItem.amount) }} мес
                    </v-alert>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="close"
                    >
                      {{ 'Cancel' | localize }}
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
                    >
                      {{ 'Save' | localize }}
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">Вы хотите удалить эту запись?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">{{ 'Cancel' | localize }}</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:item.amount="{ item }">
          {{ item.amount | number }}
        </template>
        <template v-slot:item.type="{ item }">
          {{ typeAdvance[item.type] }}
        </template>
        <template v-slot:item.datetime="{ item }">
          {{ item.datetime | date(false) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>

      </v-data-table>

    </v-card-text>

    <pre>{{ calculateLoanAnnuity }}</pre>

  </v-card>
</template>

<script>
import dateFilter from "@/filters/date.filter";
import {addMonths, baseLog} from "@/utils/helpers";

export default {
  name: "CreditCalcAdvancePayment",
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
    },
    dateStartPayment: {
      type: Date,
      required: true
    }
  },
  data() {
    return {
      calcInflation: false,
      inflationRate: 4.5,
      advancePaymentsHeaders: [
        {value: 'amount', text: 'Сумма'},
        {value: 'datetime', text: 'Дата платежа'},
        {value: 'type', text: 'Погашение'},
        {value: 'actions', text: 'Действия'}
      ],
      typeAdvance: {
        term: 'Срок',
        payment: 'Платеж'
      },
      advancePayments: [],
      editedItem: {amount: null, datetime: null, type: null},
      amountRules: [
        v => !!v || 'Введите сумму досрочного погашения',
        v => v > 0 || 'Сумма должна быть больше 0',
        v => +v <= this.creditAmount || 'Сумма не может быть больше полного погашения'
      ],
      datetimeRules: [
        v => !!v || 'Введите дату досрочного погашения',
        v => /\d{4}-\d{2}-\d{2}/.test(v) || 'Введитие корректную дату'
      ],
      typeRules: [
        v => !!v || 'Выберите тип досрочного погашения'
      ],
      itemIndex: -1,
      valid: false,
      dialog: false,
      newItem: {amount: null, datetime: null, type: null},
      dialogDelete: false,
      dateOfPayment: null,
      dateOfPaymentMenu: false,

    }
  },
  computed: {
    formTitle() {
      return this.itemIndex === -1 ? 'Добавить' : 'Редактировать'
    },

    calculateLoanAnnuity() {

      const currMonth = new Date(this.dateStartPayment)
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
          i,
          datetime: month,
          payment: payment,
          interest: interest,
          body: body,
          amountLeft: amountLeft,
          amountPayed: paymentTotal
        })

        const advPayment = this.advancePayments.find(item => {
          return (addMonths(currMonth, i) <= item.datetime && item.datetime < addMonths(currMonth, i + 1))
        })

        if (advPayment && advPayment.type && +advPayment.amount > 0) {
          payment = +advPayment.amount
          n = this.numberOfPaymentsLeft(paymentAnnuity, r, amountLeft)
          body = payment
          month = advPayment.datetime
          amountLeft -= body
          paymentTotal += payment
          if (advPayment.type === 'payment') {
            paymentAnnuity = amountLeft * (r * (1 + r) ** n) / ((1 + r) ** n - 1)
          }
          history.push({
            i,
            datetime: month,
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
    }

  },
  methods: {
    numberOfPaymentsLeft(payment, interestRate, amountLeft) {
      return Math.ceil(baseLog(1 + interestRate, payment / (payment - interestRate * amountLeft)))
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dateOfPayment = item.datetime.toJSON().substr(0, 10)
      this.itemIndex = this.advancePayments.indexOf(item)
      this.dialog = true
    }
    ,
    deleteItem(item) {
      this.itemIndex = this.advancePayments.indexOf(item)
      this.dialogDelete = true
    }
    ,
    save() {
      if (!this.valid) {
        this.$refs.editForm.validate()
        return
      }

      this.editedItem.datetime = new Date(this.dateOfPayment)
      if (this.itemIndex === -1) {
        this.advancePayments.push(Object.assign({}, this.editedItem))
      } else {
        Object.assign(this.advancePayments[this.itemIndex], this.editedItem)
      }
      this.close()
    }
    ,
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.$refs.editForm.reset()
        this.itemIndex = -1
        this.editedItem = Object.assign({}, this.newItem)
      })
    }
    ,
    closeDelete() {
      this.itemIndex = -1
      this.dialogDelete = false
    }
    ,
    deleteItemConfirm() {
      this.advancePayments.splice(this.itemIndex, 1)
      this.itemIndex = -1
      this.closeDelete()
    }
  }
}
</script>

<style scoped>

</style>

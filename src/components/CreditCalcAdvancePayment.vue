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
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            :label="'Дата платежа'"
                          ></v-text-field>
                        </v-col>
                        <v-radio-group>
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
  </v-card>

</template>

<script>
import dateFilter from "@/filters/date.filter";

export default {
  name: "CreditCalcAdvancePayment",
  data: () => ({
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
    advancePayments: [
      {id: 1, amount: 1000000, datetime: new Date('2022-05-07'), type: 'payment'}
    ],
    editedItem: {},
    valid: false,
    dialog: false

  }),
  computed: {
    formTitle() {
      return 'Создать'
    }
  },
  methods: {
    editItem(item) {

    },
    deleteItem(item) {

    },
    save() {

    },
    close() {

    }
  }
}
</script>

<style scoped>

</style>

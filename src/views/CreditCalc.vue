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
        <v-select
          label="Тип кредита"
          :items="creditTypes"
          v-model="creditType"
          item-text="text"
          item-value="value"
        >
        </v-select>
          <v-text-field
            type="number"
            label="Стоимость объекта"

          ></v-text-field>


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
  data: ()=>({
    creditTypes: [
      {text: 'Ипотека', value: 'mortgage'},
      {text: 'Автокредит', value: 'carLoan'},
      {text: 'Потребительский', value: 'consumerLoan'}
    ],
    creditType: 'mortgage'
  })
}
</script>

<style scoped>

</style>

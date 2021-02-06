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

  </v-card>

</template>

<script>
export default {
  name: "CreditCalcAdvancePayment",
  data: () => ({
    calcInflation: false,
    inflationRate: 4.5
  })
}
</script>

<style scoped>

</style>
